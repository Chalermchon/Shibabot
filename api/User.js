import { Router } from 'express'
import axios from 'axios'
import { auth, groupCol, userCol } from '../firebase-admin'
import { pushText, setRichmenuFor } from '../webhook/LINE/functions'

const { CHANNEL_ID } = process.env

const userAPI = Router()

userAPI.get('/:user_id', async (req, res) => {
    const { user_id } = req.params
    try {
        const user = await userCol.doc(user_id).get()
        return res.status(200).send({
            uid: user_id,
            gid: user.exists ? user.data().groupId : undefined,
            exists: user.exists,
        })
    } catch (err) {
        return res.status(500).send('internal-server-error')
    }
})

userAPI.post('/generate-auth-token', async (req, res) => {
    const { access_token, user_id } = req.body
    try {
        if ( typeof access_token === 'undefined') {
            return res.status(404).send('access_token-not-found')
        }
        const { data: { client_id } } = await axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${access_token}`)
        if ( client_id !== CHANNEL_ID ) {
            return res.status(401).send('unauthorized')
        }
        const user = await auth.getUser(user_id)
        const { groupId } = (await userCol.doc(user_id).get()).data()
        const token = await auth.createCustomToken(user.uid, {gid: groupId})
        return res.status(200).send(token)
    } catch (err) {
        if (err.code === 'auth/user-not-found')
            return res.status(404).send('user-not-found')
        console.error(err)
        return res.status(500).send('internal-server-error')
    }
})

userAPI.post('/register', async (req, res) => {
    try {
        const { user_id, group_id, local_location } = req.body;
        const group = await groupCol.doc(group_id).get()
        if (group.exists) {
            const user = await userCol.doc(user_id).get()    
            if (!user.exists || !user.data().groupId || user.data().groupId !== group_id) {
                auth.createUser({
                    uid: user_id
                })
                    .then(() => {
                        console.log('       > User:', user_id, '-JOIN->', group_id)
                    })
                    .catch(err => {
                        if (err.code !== 'auth/uid-already-exists') {
                            throw err
                        }
                        console.log('       > User:', user_id, '-MOVE->', group_id)
                    })
                if (user.exists && !user.data().groupId) {
                    await userCol.doc(user_id).update({ 
                        groupId: group_id,
                        localLocation: local_location
                    })
                    await setRichmenuFor(user_id)
                    await pushText(user_id, [
                        'มาเรื่มใช้งานกันเลยนะครับ',
                        'คคุณสามารถเข้าไป "เลือกซื้อสินค้า" หรือจะลงขายสินค้าได้ใน "ร้านค้าของฉัน" ในเมนูหลักได้เลยนะค้าบบ'
                    ])
                } else {
                    await userCol.doc(user_id).set({ 
                        groupId: group_id,
                        localLocation: local_location
                    })
                }
                return res.status(201).send()
            }
            return res.status(200).send()
        }
        return res.status(404).send('not-found')
    }
    catch (err) {
        console.log(err)
        return res.status(500).send('internal-server-error')
    }
})

export default userAPI