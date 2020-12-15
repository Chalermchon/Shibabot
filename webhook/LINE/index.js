import { Router } from 'express'
import { replyFlexWhenJoinGroup, replyText, setRichmenuFor, unsetRichmenuFor, verifyXLineSignature } from './functions'
import { userCol, groupCol, FieldValue } from '../../firebase-admin'

const lineWebhook = Router()

lineWebhook.post('/', async (req, res) => {
    const [event] = req.body.events
    const { type, source, replyToken } = event
    const { userId, groupId, roomId } = source

    try {
        if (verifyXLineSignature(req)) {
            switch (type) {
                case 'follow':
                    const user = await userCol.doc(userId).get()
                    if (user.exists && user.data().groupId) {
                        console.log('FOLLOW:: user exists')
                        await userCol.doc(userId).update({
                            isFriend: true
                        })
                        await setRichmenuFor(userId)
                        await replyText(replyToken, [
                            'มาเรื่มใช้งานกันเลยนะครับ',
                            'คุณสามารถเข้าไป "เลือกซื้อสินค้า" หรือจะลงขายสินค้าได้ใน "ร้านค้าของฉัน" ในเมนูหลักได้เลยนะค้าบบ',
                        ])
                    } else {
                        await userCol.doc(userId).set({
                            isFriend: true
                        })
                        await replyText(replyToken, [
                            'ผมเป็นบอท(โปรแกรมโต้ตอบอัตโนมัติ) ที่จะเป็นคนกลางในการซื้อขายสินค้าต่างๆภายในหมู่บ้านของคุณ',
                            'แต่ก่อนจะเริ่มใช้งานผมจำเป็นจะต้องรู้จักหมู่บ้านและเพื่อนบ้านคนอื่นๆของคุณก่อน',
                            'รบกวนช่วยชวนผมเข้ากลุ่มหมู่บ้านของคุณ เพื่อให้ผมสามารถใช้งานได้',
                            'และถ้าผมอยู่ในกลุ่มแล้วรบกวนช่วยกดปุ่ม "ลงทะเบียน" ให้ด้วยนะครับ',
                        ])
                    }
                    return res.status(200).json({status: 'success'})
                case 'unfollow':
                    await userCol.doc(userId).update({
                        isFriend: false
                    })
                    return res.status(200).json({status: 'success'})
                case 'join':
                    if (roomId) {
                        await replyText(replyToken, 'ขอโทษด้วยนะครับ แต่ผมยังไม่รองรับการใช้งานในรูปแบบห้องนะครับ')
                    } else {
                        await groupCol.doc(groupId).set({})
                        await replyFlexWhenJoinGroup(groupId, replyToken)
                    }
                    return res.status(200).json({status: 'success'})
                case 'leave':
                    if (groupId) {
                        const users = await userCol.where('groupId', '==', groupId).get()
                        for (let i = 0; i < users.docs.length; i++) {
                            const user = users.docs[i]
                            await userCol.doc(user.id).update({
                                groupId: FieldValue.delete(),
                                localLocation: FieldValue.delete(),
                                products: FieldValue.delete(),
                                orders: FieldValue.delete()
                            })
                            await unsetRichmenuFor(user.id)
                        }
                        await groupCol.doc(groupId).delete()
                    }
                    return res.status(200).json({status: 'success'})
                case 'memberJoined':
                    if (groupId) {
                        const members = event.joined.members
                        for (let i = 0; i < members.length; i++) {
                            const member = members[i];
                            await userCol.doc(member.userId).set({
                                isFriend: false,
                                groupId: groupId
                            })
                        }
                    }
                    return res.status(200).json({status: 'success'})
                case 'memberLeft':
                    if (groupId) {
                        const members = event.left.members
                        for (let i = 0; i < members.length; i++) {
                            const member = members[i];
                            await userCol.doc(member.userId).update({
                                groupId: FieldValue.delete(),
                                localLocation: FieldValue.delete(),
                                products: FieldValue.delete(),
                                orders: FieldValue.delete()
                            })
                            await unsetRichmenuFor(userId)
                        }
                    }
                    return res.status(200).json({status: 'success'})
                case 'message':
                    if (source.type === 'user') {
                        await replyText(replyToken, 'ขอโทษด้วยนะครับ แต่ผมยังไม่รองรับโต้ตอบข้อความนะครับ')
                    }
                    return res.status(200).json({status: 'success'})
                default:
                    return res.status(200).json({status: 'success'})
            }
        }
        return res.status(406).json({status: 'error', error: 'Not Acceptable'})
    } catch (e) {
        if (e.host === 'api.line.me') {
            console.error(JSON.stringify(e.response.data))
        } else {
            console.error(e)
        }
        return res.status(500).send({status: 'error', error: 'Internal Server Error'})
    }
})

export default lineWebhook