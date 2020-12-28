import React from 'react'
import { BiScan } from 'react-icons/all'
import styled from 'styled-components'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/th'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

const ProductOrderCard = ({ user: {name, image, localLocation}, amount, totalCost, createdAt }) => {

    return (
        <Root>
            <Badge>{amount} ชิ้น</Badge>
            <Header>
                <UserProfile size={32} style={{marginRight: '10px'}}
                    src={image} 
                />
                {name}
                <br/>
                บ้านเลขที่ {localLocation}
            </Header>
            <Seperator />
            <CreatedAt>
                {
                    'สั่งเมื่อ '+
                    dayjs(createdAt.toDate()).tz('Asia/Bangkok').locale('th')
                    .format('D MMM YYYY | HH:mm')
                }
            </CreatedAt>
            <Cost>ยอดสุทธิ {totalCost} บาท</Cost>
            <Button onClick={() => window.location = 'https://line.me/R/nv/QRCodeReader'}> 
                <BiScan size={18} style={{margin: '0 10px 0 0'}} />
                ส่งมอบสินค้า 
            </Button>
        </Root>
    )
}

export default ProductOrderCard


const Root = styled.div`
    width: 80%;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin: 20px auto;
    box-shadow: 0px 2px 15px #2D2D2D9C;
    border-radius: 15px;
`
const Badge = styled.div`
    position: absolute;
    top: 0; right: 0;
    padding: 0 10px;
    color: white;
    background-color: red;
    border-radius: 0 15px;
`
const CreatedAt = styled.div`
    width: fit-content;
    margin: -16px 0 0px auto;
    padding: 0 10px;
    font-size: 10px;
    color: white;
    background-color: #929292;
    border-radius: 10px;
`
const Header = styled.div`
    color: #505050;
    font-size: 16px;
    font-weight: 400;
    display: flex;
    flex-direction: row;
    align-items: center;
`
const UserProfile = styled.div`
    width: ${({ size }) => size}px; height: ${({ size }) => size}px;
    border-radius: 50%;
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`
const Seperator = styled.hr`
    width: 90%; height: 0px;
    border: 0.25px solid #DEDEDEB5;
`
const Cost = styled.h3`
    margin: 10px 0px;
    text-align: center;
    font-size: 17px;
    color: red;
`
const Button = styled.button`
    outline: none; user-select: none;
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