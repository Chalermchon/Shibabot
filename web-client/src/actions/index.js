import liff from '@line/liff'
import axios from 'axios'
import { auth } from '../firebase-web'

const generateAuthToken = async (access_token, user_id) => {
    setTimeout(() => {
        generateAuthToken( access_token, user_id )
    // }, 1800000)
    }, 60000)
    const { data: token } = await axios.post('/api/user/generate-auth-token', {
        access_token, user_id 
    })
    await auth.signInWithCustomToken(token)
    console.log('LOGIN')
}

export const fetchLineLiff = () => async dispatch => {
    await liff.init({ liffId: '1655370887-nqO5DklP' })
    if (liff.isInClient() || liff.isLoggedIn()) {
        const { userId, displayName, pictureUrl } = await liff.getProfile()
        const accessToken = liff.getAccessToken()
        generateAuthToken(accessToken, userId )
        dispatch({
            type: 'SET_USER',
            payload: {
                userId: userId,
                name: displayName,
                image: pictureUrl,
            }
        })
    } else {
        liff.login()
    }
}