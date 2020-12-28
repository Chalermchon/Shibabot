import React from 'react'
import { VscPackage, BiTimeFive, IoQrCodeOutline, AiOutlineHome } from 'react-icons/all'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { DEVICE } from '../../GlobalValue'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import 'dayjs/locale/th'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)

const UserOrderCard = ({ orderId, name, image, cost, amount, createdAt, user }) => {
    const history = useHistory()

    return (
        <Root>
            <Header>
                <Media src={image} />
                <Content>
                    <Title>{name}</Title>
                    <Seperator />
                    <Detail>
                        <VscPackage size={16} style={{margin: '2px 5px 0 0'}} /> 
                        สั่งเป็นจำนวน {amount} ชิ้น
                    </Detail>
                    <Detail>
                        <BiTimeFive size={16} style={{margin: '2px 5px 0 0'}} /> 
                        สั่งเมื่อ {
                            dayjs(createdAt.toDate()).tz('Asia/Bangkok').locale('th')
                            .format('D MMM YYYY | HH:mm')
                        }
                    </Detail>
                    <Detail>
                        <UserProfile size={16} style={{margin: '2px 5px 0 0'}} 
                            src={user.image}
                        />
                        {user.name}
                    </Detail>
                    <Detail>
                        <AiOutlineHome size={16} style={{margin: '1px 5px 0 0'}} />
                        {user.localLocation}
                    </Detail>
                </Content>
            </Header>
            <Footer>
                <Button onClick={()=>history.push(`/qr-code/${orderId}`)} > 
                    <IoQrCodeOutline size={18} style={{margin: '0 10px 0 0'}} />
                    รับมอบสินค้า
                </Button>
                <Cost>ยอดสุทธิ {cost * amount} บาท</Cost>
            </Footer>
        </Root>
    )
}

export default UserOrderCard

const Root = styled.div`
    display: flex;
    flex-direction: column;
    @media ${DEVICE.LOWER.SM} {
        width: 280px; height: fit-content;
        padding: 5px;
    }
    @media ${DEVICE.UPPER.SM} {
        width: 340px; height: fit-content;
        padding: 10px;
    }
    margin-bottom: 20px;
    box-shadow: 0px 2px 15px #2D2D2D9C;
    border-radius: 15px;
`
const Header = styled.div`
    display: flex;
    flex-direction: row;
`
const Footer = styled.div`
    margin: 10px 0 0 0;
`
const Media = styled.div`
    @media ${DEVICE.LOWER.SM} {
       width: 100px; height: 100px;
       margin-right: 10px;
    }
    @media ${DEVICE.UPPER.SM} {
        width: 120px; height: 120px;
        margin-right: 20px;
    }
    border-radius: 10px;
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`
const Content = styled.div`
    position: relative;
    height: 100px;
    @media ${DEVICE.UPPER.SM} {
        width: 210px; height: 120px;
    } 
`
const Title = styled.h4`
    font-family: 'Kanit';
    margin: unset;
    color: #4C4C4C;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
`
const Seperator = styled.hr`
    margin: 2px 0 5px 0;
    border: 0.25px solid #DEDEDEB5;
`
const UserProfile = styled.div`
    width: ${({ size }) => size}px; height: ${({ size }) => size}px;
    border-radius: 50%;
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`
const Detail = styled.div`
    color: #757575;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
`
const Cost = styled.h3`
    margin: 10px 0px 0px 0;
    padding: 10px 0 5px 0;
    text-align: center;
    font-size: 17px;
    color: red;
    border-top: 1px solid #9494947A;
`
const Button = styled.button`
    outline: none;
    width: 100%; height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: auto;
    border: none; border-radius: 10px;
    font-size: 16px;
    color: white;
    background-color: ${({ theme }) => theme.colors.primary};
`