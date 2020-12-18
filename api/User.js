import { Router } from 'express'
import axios from 'axios'
import { auth, groupCol, userCol } from '../firebase-admin'
import { pushText, setRichmenuFor } from '../webhook/LINE/functions'

const { LINE_CHANNEL_ID } = process.env

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
        return res.status(500).send('Internal Server Error')
    }
})

userAPI.post('/generate-auth-token', async (req, res) => {
    const { access_token, user_id } = req.body
    try {
        if ( typeof access_token === 'undefined') {
            return res.status(404).send('AccessToken Not Found')
        }
        const { data: { client_id } } = await axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${access_token}`)
        if ( client_id !== LINE_CHANNEL_ID ) {
            return res.status(401).send('Unauthorized')
        }
        const user = await auth.getUser(user_id)
        const token = await auth.createCustomToken(user.uid)
        return res.status(200).send(token)
    } catch (err) {
        if (err.code === 'auth/user-not-found')
            return res.status(404).send('User Not Found')
        console.error(err)
        return res.status(500).send('Internal Server Error')
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
                    .then(() => console.log('       > User_[N]:', user_id, '->', group_id))
                    .catch(err => {
                        if (err.code === 'auth/uid-already-exists') {
                            console.log('       > User_[U]:', user_id, '->', group_id)
                        } else {
                            throw err
                        }
                    })
                if (user.exists && !user.data().groupId) {
                    await userCol.doc(user_id).update({ 
                        groupId: group_id,
                        localLocation: local_location
                    })
                    await setRichmenuFor(user_id)
                    await pushText(user_id, [
                        'มาเรื่มใช้งานกันเลยนะครับ',
                        'คุณสามารถเข้าไป "เลือกซื้อสินค้า" หรือจะลงขายสินต้าได้ใน "ร้านค้าของฉัน" ในเมนูหลักได้เลยยย'
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
        return res.status(404).send('Not found')
    }
    catch (err) {
        console.log(err)
        return res.status(500).send('Internal Server Error')
    }
})

export default userAPI