import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNotifications } from 'reapop'
import axios from 'axios'
import liff from '@line/liff'
import styled from 'styled-components'
import { groupCol, userCol } from '../../firebase-web'
import { TextField, Loader } from '../../components'

const RegisterPage = ({ match }) => {
    const { notify } = useNotifications()
    const { groupId } = match.params
    const { userId } = useSelector(state => state.user)
    const [localLocation, setLocalLocation] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userId) {
            if (groupId)
            groupCol.doc(groupId).get()
                .then( group => {
                    return new Promise((resolve, reject) => {
                        if (group.exists) {
                            resolve(userCol.doc(userId).get())
                        } else {
                            reject('group-not-found')
                        }
                    })
                })
                .then(user => {
                    if (user.exists && user.data().groupId && user.data().groupId === groupId) {
                        liff.openWindow({ url: 'https://line.me/R/ti/p/@610npkuz' })
                        liff.closeWindow()
                    } else {
                        setLoading(false)
                    }
                })
                .catch(err => {
                    if (err === 'group-not-found') {
                        notify({
                            status: 'error',
                            title: 'ไม่พบกลุ่ม',
                            message: 'กรุณาชวนน้องบอทเข้ากลุ่มก่อนใช้งานนะคะ',
                            position: 'top-center',
                            dismissAfter: 0, 
                            buttons: [{
                                name: 'OK',
                                primary: true,
                                onClick: () => {
                                    setLoading(false)
                                    liff.closeWindow()
                                }
                            }],
                        })
                    } else {
                        console.error(err)
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
        setLoading(true)
        axios.post('/api/user/register', {
            user_id: userId,
            group_id: groupId,
            local_location: localLocation 
        })
            .then(() => {
                liff.openWindow({ url: 'https://line.me/R/ti/p/@610npkuz' })
                liff.closeWindow()
            })
            .catch((err) => {
                console.error(err)
            })
    }

    return (
        <Root>
            {
                !loading
                ?   <>
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
                    </>
                :   <Loader />      
            }
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