import React from 'react'
import { VscPackage, BiTimeFive, HiOutlineClipboardList } from 'react-icons/all'
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

const ProductCard = ({ name, image, cost, amount, type, total, until }) => {
    const now = dayjs().tz('Asia/Bangkok').locale('th')

    return (
        <Root>
            <Media src={image} />
            <Content>
                <Title>{name}</Title>
                <Seperator />
                <Detail>
                    <HiOutlineClipboardList size={16} style={{margin: '2px 5px 0 0'}} /> 
                    มีผู้สั่งซื้อแล้ว {amount} ชิ้น
                </Detail>
                {
                    type === 'in-stock'
                    ?   <Detail>
                            <VscPackage size={16} style={{margin: '2px 5px 0 0'}} /> 
                            ลงขายทั้งหมด {total} ชิ้น
                        </Detail>
                    : type === 'pre-order'
                    ?   <Detail>
                            <BiTimeFive size={16} style={{margin: '2px 5px 0 0'}} /> 
                            {
                                dayjs().isSameOrBefore(until.toDate())
                                ? `ปิดการขายใน${now.to(until.toDate())}`
                                : `ปิดการขายเมื่อ ${now.to(until.toDate())}`
                            }
                            
                            <br/>
                            ( {
                                dayjs(until.toDate()).tz('Asia/Bangkok').locale('th')
                                .format('D MMM YYYY | HH:mm')
                            } )
                        </Detail>
                    : null
                }
                <Main>ราคา {cost} บาท</Main>
                <Badge>
                    {type === 'in-stock'
                        ? 'พร้อมส่ง'
                    : type === 'pre-order'
                        ? 'สั่งซื้อล่วงหน้า'
                    : null}
                </Badge>
            </Content>
        </Root>
    )
}

export default ProductCard

const Root = styled.div`
    display: flex;
    flex-direction: row;
    @media ${DEVICE.LOWER.SM} {
        width: 280px; height: 100px;
        padding: 5px;
    }
    @media ${DEVICE.UPPER.SM} {
        width: 340px; height: 120px;
        padding: 10px;
    }
    margin-bottom: 20px;
    box-shadow: 0px 2px 15px #2D2D2D9C;
    border-radius: 15px;
`
const Media = styled.div`
    @media ${DEVICE.LOWER.SM} {
       width: 100px; height: 100px;
       margin-right: 5px;
    }
    @media ${DEVICE.UPPER.SM} {
        width: 120px; height: 120px;
        margin-right: 10px;
    }
    border-radius: 10px;
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`
const Content = styled.div`
    position: relative;
    width: 180px; height: 100px;
    @media ${DEVICE.UPPER.SM} {
        width: 210px; height: 120px;
    } 
`
const Title = styled.h4`
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
const Detail = styled.div`
    color: #757575;
    margin-left: 5px;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
`
const Main = styled.h3`
    position: absolute;
    bottom: -5px;
    margin: unset;
    font-size: 17px;
    color: red;
`
const Badge = styled.div`
    position: absolute;
    @media ${DEVICE.LOWER.SM} { bottom: -4px; right: -4px; }
    @media ${DEVICE.UPPER.SM} { bottom: -8px; right: -8px; }
    padding: 2px 10px;
    font-size: 14px;
    color: white;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 15px 0 15px 0px;
`