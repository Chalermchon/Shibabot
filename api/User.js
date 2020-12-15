import { Router } from 'express'
import { groupCol, userCol } from '../firebase-admin'
import { pushText, setRichmenuFor } from '../webhook/LINE/functions'

const userAPI = Router()

userAPI.post('/generate-auth-token', async (req, res) => {
    const { access_token, user_id, group_id } = req.body
    try {
        if ( typeof access_token === 'undefined') {
            return res.status(404).send('AccessToken Not Found')
        }
        const { data: { client_id } } = await axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${access_token}`)
        if ( client_id !== LINE_CHANNEL_ID ) {
            return res.status(401).send('Unauthorized')
        }
        const firebaseUser = await firebase.auth().getUser(user_id)
        const token = await firebase.auth().createCustomToken(firebaseUser.uid)
        return res.status(200).send(token)
    } catch (err) {
        if (err.code === 'auth/user-not-found') {
            const firebaseUser = await firebase.auth().createUser({
                uid: user_id,
                gid: group_id
            })
            const token = await firebase.auth().createCustomToken(firebaseUser.uid)
            return res.status(200).send(token)
        }
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
            if (!user.exists || !user.data().groupId) {
                if (user.exists) {
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
                    console.log('API:: user not exists')
                    await userCol.doc(user_id).set({ 
                        groupId: group_id,
                        localLocation: local_location
                    })
                }
                return res.status(201).send();
            }
            return res.status(200).send();
        }
        return res.status(404).send('Not found')
    }
    catch (err) {
        console.log(err)
        return res.status(500).send('Internal Server Error');
    }
})

export default userAPI