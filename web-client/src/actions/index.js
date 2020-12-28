import liff from '@line/liff'
import axios from 'axios'
import { auth, groupCol, userCol } from '../firebase-web'
import { CATEGORIES } from '../GlobalValue'

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
            dispatch({ type: 'SET_ERROR', payload: true })
        }
    }
}

export const InitLiffAndSignIn = () => async dispatch => {
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
    auth.onAuthStateChanged( async (currentUser) => {
        if (currentUser) {
            dispatch({ type: 'SET_USER', payload: { isSignIn: true } })
            userCol.doc(currentUser.uid).onSnapshot(userSnapShot => {
                dispatch({ type: 'SET_USER', payload: userSnapShot.data() })
            })
            const {claims: {gid}} = await currentUser.getIdTokenResult()
            Object.keys(CATEGORIES).forEach((category) => {
                dispatch({type: 'SET_PRODUCTS', payload: {[category]: null}})
                groupCol.doc(gid).collection(`Products_${category}`)
                    .onSnapshot(productsSnapShot => {
                        const products = {}
                        if (!productsSnapShot.empty) {
                            productsSnapShot.docs.forEach(product => {
                                products[product.id] = product.data()
                            })
                        }
                        dispatch({ type: 'SET_PRODUCTS', payload: { [category]: products } })
                    })
            })
            groupCol.doc(gid).collection('Orders')
                .onSnapshot(ordersSnapShot => {
                    if (!ordersSnapShot.empty) {
                        const orders = {}
                        ordersSnapShot.docs.forEach(order => {
                            orders[order.id] = order.data()
                        })
                        dispatch({ type: 'SET_ORDERS', payload: orders })
                    }
                })
            userCol.where('groupId', '==', gid)
                .onSnapshot(usersSnapShot => {
                    if (!usersSnapShot.empty) {
                        const neighbors = {}
                        usersSnapShot.docs.forEach(user => {
                            if (user.id !== currentUser.uid) {
                                neighbors[user.id] = user.data()
                            } else {
                                liff.getProfile()
                                    .then(({displayName, pictureUrl}) => {
                                        const { name, image } = user.data()
                                        if (displayName !== name || pictureUrl !== image) {
                                            userCol.doc(currentUser.uid).update({
                                                name: displayName, image: pictureUrl
                                            })
                                        }
                                    })
                                    .catch(err => console.error(err))
                            }
                        })
                        dispatch({ type: 'SET_NEIGHBORS', payload: neighbors })
                    }
                })
        } else {
            liff.logout()
            dispatch({ type: 'SET_USER', payload: { isSignIn: false } })
        }
    })
}