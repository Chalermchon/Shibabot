import liff from '@line/liff'

export const fetchLineLiff = () => async dispatch => {
    await liff.init({ liffId: '1655370887-nqO5DklP' })
    if (liff.isInClient() || liff.isLoggedIn()) {
        const { userId, displayName, pictureUrl } = await liff.getProfile()
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