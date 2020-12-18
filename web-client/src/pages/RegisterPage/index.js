import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import liff from '@line/liff'
import styled from 'styled-components'
import { useToasts } from 'react-toast-notifications'
import { TextField } from '../../components'

const RegisterPage = ({ location }) => {
    const dispatch = useDispatch()
    const { addToast } = useToasts()
    const { gid: groupId } = Object.fromEntries(new URLSearchParams(location.search))
    const { userId } = useSelector(state => state.user)
    const [localLocation, setLocalLocation] = useState('')

    const redirectToAddFriend = () => {
        if (liff.isInClient()) {
            liff.openWindow({ url: 'https://line.me/R/ti/p/@610npkuz' })
            liff.closeWindow()
        } else {
            window.location = 'https://line.me/R/ti/p/@610npkuz'
        }
    }

    useEffect(() => {
        if (userId && groupId) {
            axios.get(`/api/group/${groupId}`)
                .then( ({data: group}) => {
                    return new Promise((resolve, reject) => {
                        if (group.exists) {
                            resolve(axios.get(`/api/user/${userId}`))
                        } else {
                            reject('group-not-found')
                        }
                    })
                })
                .then( ({data: user}) => {
                    if (user.exists && user.gid === groupId) {
                        redirectToAddFriend()  
                    } else {
                        if (user.gid !== groupId) {
                            addToast('ถ้าคุณลงทะเบียนกับกลุ่มนี้ ข้อมูลในกลุ่มเก่าของคุณจะถูกลบทั้งหมด', {
                                appearance: 'warning'
                            })
                        }
                        dispatch({ type: 'SET_LOADER', payload: { loading: false, animate: false } })
                    }
                })
                .catch(err => {
                    if (err === 'group-not-found') {
                        dispatch({ type: 'SET_ERROR', payload: {
                            isError: true,
                            title: 'ไม่พบกลุ่ม',
                            description: 'กรุณาชวนบอทเข้ากลุ่มก่อนนะคะ'
                        }})
                    } else {
                        dispatch({ type: 'SET_ERROR', payload: {
                            isError: true,
                            title: 'พบข้อผิดพลาดบางอย่าง',
                            description: 'กรุณาลองใหม่ในภายหลัง'
                        }})
                        console.log(err)
                    }
                })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupId, userId])

    const handleChange = (e) => {
        if(!e.target.value.match(/[^\d/]/)) {
            setLocalLocation(e.target.value)
        }
    }
    const handleSubmit = (e) => {
        dispatch({ type: 'SET_LOADER', payload: { loading: true, animate: true } })
        axios.post('/api/user/register', {
            user_id: userId,
            group_id: groupId,
            local_location: localLocation 
        })
            .then(() => {
                redirectToAddFriend()
            })
            .catch((err) => {
                dispatch({ type: 'SET_ERROR', payload: {
                    isError: true,
                    title: 'พบข้อผิดพลาดบางอย่าง',
                    description: 'กรุณาลองใหม่ในภายหลัง'
                }})
                console.error(err)
            })
    }

    return (
        <Root>
            <Caption>กรุณากรอกที่อยู่ของคุณ</Caption>
            <TextField
                label="บ้านเลขที่"
                value={localLocation}                
                handleChange={handleChange}
            />
            <Button 
                onClick={handleSubmit} 
                disabled={!localLocation.match(/^\d*(\d|\/\d+)$/)} 
            >
                ยืนยัน
            </Button>
        </Root>
    )
}

export default RegisterPage

const Root = styled.div`
    height: ${window.innerHeight}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
const Caption = styled.h2`
    color: ${({ theme }) => theme.colors.primary};
    margin: 10px 0;
    font-weight: 400;
`
const Button = styled.button`
    outline: none;
    width: 200px; height: 40px;
    margin-top: 30px;
    border: none; border-radius: 20px;
    font-size: 16px;
    color: ${({ disabled }) => disabled ? '#969696' : 'white'};
    background-color: ${({ theme, disabled }) => disabled ? 'transparent' : theme.colors.primary};
    box-shadow: ${({ disabled }) => disabled ? 'none' : '0 2px 3px #003DAFAB'}; 
    transition: all .25s ease-in-out;
    :focus {
        color: ${({ theme }) => theme.colors.primary};
        background-color: white;
        border: 1px solid ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 3px #003DAFAB;
    }
`