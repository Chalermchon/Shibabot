import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { redirectToAddFriendOrLineChat } from '../../actions'

const SendProduct = ({ match }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { orderId } = match.params
    const { isFriend, notRegister, groupId, userId } = useSelector(state => state.user)

    useEffect(() => {
        dispatch({ type: 'SET_LOADER', payload: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if ( notRegister || (isFriend !== undefined && !isFriend) ) {
            redirectToAddFriendOrLineChat()
        } else {
            axios.post('/api/order/send', {order_id: orderId, group_id: groupId, user_id: userId})
                .then(() => {
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
                })
                .catch(err => {
                    const { status } = err.response
                    if (status === 404) {
                        dispatch({ type: 'SET_ERROR', payload: {
                            isDisplay: true,
                            title: 'ไม่พบคำสั่งซื้อ',
                            description: ''
                        }})
                    } else if (status === 403) {
                        dispatch({ type: 'SET_ERROR', payload: {
                            isDisplay: true,
                            title: 'คุณไม่่ใช่ผู้ลงขายสินค้านี้',
                            description: ''
                        }})
                    } else {
                        dispatch({ type: 'SET_ERROR', payload: true })
                    }
                })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notRegister, isFriend])

    return (
        <div/>
    )
}

export default SendProduct