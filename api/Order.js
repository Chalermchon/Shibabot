import { Router } from 'express'
import { pushText } from '../webhook/LINE/functions'
import { FieldValue, groupCol, userCol } from '../firebase-admin'

import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter)

const orderAPI = Router()

orderAPI.post('/created', async (req, res) => {
    const { order_id, group_id } = req.body
    try {
        const order = (await groupCol.doc(group_id).collection('Orders').doc(order_id).get()).data()
        const user = (await userCol.doc(order.userId).get()).data()
        const product = (await groupCol.doc(group_id).collection(`Products_${order.category}`).doc(order.productId).get()).data()
        
        await groupCol.doc(group_id).collection(`Products_${order.category}`).doc(order.productId).update({
            amount: FieldValue.increment(order.amount),
            orders: FieldValue.arrayUnion(order_id)
        })
        await userCol.doc(order.userId).update({
            orders: FieldValue.arrayUnion(order_id)
        })

        await pushText(product.userId, `${user.name} ได้สั่งซื้อ ${product.name} จำนวน ${order.amount} ชิ้น`)
        return res.status(200).send()
    } catch (e) {
        return res.status(500).send('internal-server-error')
    }
    
})

orderAPI.post('/send', async (req, res) => {
    const { order_id, group_id, user_id } = req.body

    const orderDoc = await groupCol.doc(group_id).collection('Orders').doc(order_id).get()
    if (orderDoc.exists) {
        const order = orderDoc.data()
        const product = (await groupCol.doc(group_id).collection(`Products_${order.category}`).doc(order.productId).get()).data()
        if (product.userId === user_id) {
            await groupCol.doc(group_id).collection(`Products_${order.category}`).doc(order.productId).update({
                orders: FieldValue.arrayRemove(order_id)
            })
            await userCol.doc(order.userId).update({
                orders: FieldValue.arrayRemove(order_id)
            })
            if (
                ((product.type === 'in-stock' && product.amount === product.total) ||
                ( product.type === 'pre-order' && dayjs().isSameOrAfter(product.until)))
                && product.orders.length === 0
            ) {
                await groupCol.doc(group_id).collection(`Products_${order.category}`).doc(order.productId).update({
                    isActive: false
                }) 
            }
            return res.status(200).send()
        }
        return res.status(403).send('forbidden')
    }
    return res.status(404).send('order-not-found')
})

export default orderAPI