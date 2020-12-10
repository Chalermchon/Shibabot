import { Router } from 'express'

const userAPI = Router()

userAPI.post('/create-auth-token', async (req, res) => {
    const { access_token, user_id, group_id } = req.body
    try {
        if ( typeof access_token === 'undefined') {
            res.status(404).send('AccessToken Not Found')
        }
        const { data: { client_id } } = await axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${access_token}`)
        if ( client_id !== LINE_CHANNEL_ID ) {
            res.status(401).send('Unauthorized')
        }
        const firebaseUser = await firebase.auth().getUser(user_id)
        const token = await firebase.auth().createCustomToken(firebaseUser.uid)
        res.status(200).send(token)
    } catch (err) {
        if (err.code === 'auth/user-not-found') {
            const token = await firebase.auth().createUser({
                uid: user_id,
                gid: group_id
            })
            res.status(200).send(token)
        }
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
})

export default userAPI