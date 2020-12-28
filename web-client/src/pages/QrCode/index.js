import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { redirectToAddFriendOrLineChat } from '../../actions'

const QrCode = ({ match }) => {
    const { orderId } = match.params
    const dispatch = useDispatch()
    const history = useHistory()
    const user = useSelector(state => state.user)
    const [check, setCheck] = useState(false)

    useEffect(() => {
        dispatch({ type: 'SET_APPBAR', payload: { hidden: true }})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        dispatch({ type: 'SET_LOADER', payload: !user.isSignIn})
        if ( user.notRegister || (user.isFriend !== undefined && !user.isFriend) ) {
            redirectToAddFriendOrLineChat()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        if (user.isFriend && !user.orders) {
            history.goBack()
        } else if (user.orders.includes(orderId)) {
            setCheck(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId, user.isFriend])

    useEffect(() => {
        if (check && !user.orders.includes(orderId)) {
            dispatch({ type: 'SET_ALERT', payload: {
                    isDisplay: true,
                    type: 'success',
                    title: 'ทำรายการเสร็จสิ้น',
                    description: '',
                    button: {
                        display: true,
                        onClick: (e) => {
                            dispatch({ type: 'SET_ALERT', payload: {isDisplay: false} })
                            history.goBack()
                        }
                    }
                } })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId, check, user.orders])

    return (
        <Root >
            <Image orderId={orderId} />
        </Root>
    )
}

export default QrCode

const Root = styled.div`
    position: fixed;
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
`
const Image = styled.div`
    width: 70vw; height: 70vw;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 20px #6f6b6b;
    background-image: url(${({ orderId }) => 'https://chart.googleapis.com/chart?cht=qr&chs=512x512&chl=https://liff.line.me/1655370887-nqO5DklP/send-product/'+orderId});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`