import liff from '@line/liff'
import axios from 'axios'
import { auth, userCol } from '../firebase-web'

export const redirectToAddFriendOrLineChat = () => {
    if (liff.isInClient()) {
        liff.openWindow({ url: 'https://line.me/R/ti/p/@610npkuz' })
        liff.closeWindow()
    } else {
        window.location = 'https://line.me/R/ti/p/@610npkuz'
    }
}

const signIn = async (dispatch, userId) => {
    try {
        const accessToken = liff.getAccessToken()
        const { data: token } = await axios.post('/api/user/generate-auth-token', { 
            access_token: accessToken,
            user_id: userId 
        })
        await auth.signInWithCustomToken(token)
        dispatch({ type: 'SET_USER', payload: {isSignIn: true} })
    } catch (err) {
        if (err.response.data === 'user-not-found') {
            dispatch({ type: 'SET_USER', payload: {notRegister: true} })
        } else {
            dispatch({ type: 'SER_ERROR', payload: true })
        }
    }
}

export const fetchLineInfo = () => async dispatch => {
    try {
        await liff.init({ liffId: '1655370887-nqO5DklP' })
        if (liff.isInClient() || liff.isLoggedIn()) {
            const { userId, displayName, pictureUrl } = await liff.getProfile()
            await signIn(dispatch, userId)
            //Re Sign-In every 30 minutes.
            setInterval(() => signIn(dispatch, userId), 30*60*1000)
            dispatch({
                type: 'SET_USER',
                payload: {
                    userId: userId,
                    name: displayName,
                    image: pictureUrl,
                }
            })
        } else {
            liff.login({ redirectUri: window.location.href })
        }
    } catch (err) {
        console.log(err)
        dispatch({
            type: 'SET_ERROR',
            payload: true
        })
    }
}

export const onSignIn = () => async dispatch => {
    console.log('ON SIGN IN')
    auth.onAuthStateChanged((user) => {
        if (user) {
            dispatch({ type: 'SET_USER', payload: { isSignIn: true } })
            userCol.doc(user.uid).onSnapshot(userSnapShot => {
                dispatch({ type: 'SET_USER', payload: userSnapShot.data() })
            })
        } else {
            liff.logout()
            dispatch({ type: 'SET_USER', payload: { isSignIn: false } })
        }
    })
}