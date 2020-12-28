import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AiOutlineHome, BiTimeFive, BsColumnsGap, HiOutlineClipboardList, VscPackage } from 'react-icons/all'
import { ImageCarousel } from '../../components'
import { CATEGORIES } from '../../GlobalValue'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import 'dayjs/locale/th'
import { groupCol, Timestamp } from '../../firebase-web'
import axios from 'axios'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)

const Product = ({ match }) => {
    const now = dayjs().tz('Asia/Bangkok').locale('th')
    const history = useHistory()
    const dispatch = useDispatch()
    const { category, productId } = match.params
    const user = useSelector(state => state.user)
    const products = useSelector(state => state.products)
    const neighbors = useSelector(state => state.neighbors)
    const [product, setProduct] = useState(null)
    const [count, setCount] = useState(0)

    useEffect(() => {
        dispatch({ type: 'SET_APPBAR', payload: { hidden: true }})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (products && products[category] && neighbors) {
            const prod = {...products[category][productId], productId}
            if (prod && (
                ( prod.type === 'in-stock' && prod.amount !== prod.total ) ||
                ( prod.type === 'pre-order' && dayjs().isSameOrBefore(prod.until.toDate()) )
            )) {
                const seller = neighbors[prod.userId]
                setProduct({
                    ...products[category][productId], 
                    productId: productId,
                    seller: {
                        name: seller.name,
                        image: seller.image,
                        localLocation: seller.localLocation 
                    }
                })
            } else {
                dispatch({ type: 'SET_ALERT', payload: {
                    isDisplay: true,
                    type: 'warning',
                    title: 'สินค้านี้ปิดการขายแล้ว',
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
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, neighbors])

    const handleDecrease = (e) => {
        if (count !== 0) {
            setCount(count - 1)
        }
    }

    const handleIncrease = (e) => {
        if (( product.type === 'pre-order' ) ||
            ( product.type === 'in-stock' && (count !== product.total - product.amount) ) 
        ) {
            setCount(count + 1)
        }
    }

    const handleSubmit = (e) => {
        dispatch({type: 'SET_LOADER', payload: {loading: true, animate: true}})
        groupCol.doc(user.groupId).collection('Orders').add({
            userId: user.userId,
            productId: product.productId,
            category: product.category,
            amount: count,
            createdAt: Timestamp.now(),
        })
            .then(({id: orderId}) => {
                return axios.post('/api/order/created', {
                    order_id: orderId,
                    group_id: user.groupId
                })
            })
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
                console.error(err)
                dispatch({type: 'SET_ERROR', payload: true})
            })
    }

    return (
        <Root> 
            { !product ? 'loading'
            : (
                <> 
                    <ImageCarousel images={product.images} />
                    <Content>
                        <Name>{product.name}</Name>
                        <Type>
                            {product.type === 'in-stock'
                                ? 'พร้อมส่ง'
                            : product.type === 'pre-order'
                                ? 'สั่งซื้อล่วงหน้า'
                            : null}
                        </Type>
                        {
                            product.detail
                            ?   <Detail>
                                    {product.detail.split('\\n').map(text => (<>{text}<br/></>))}
                                </Detail>
                            :   <Separator size={100} margin={{top: 10, bottom: 20}} />
                        }
                        <Field >
                            <BsColumnsGap size={14} style={{margin: '3px 15px 0 0'}} />
                            {CATEGORIES[product.category]}
                        </Field>
                        <Field>
                            <HiOutlineClipboardList size={16} style={{margin: '2px 13px 0 0'}} /> 
                            มียอดสั่งซื้อแล้ว {product.amount} ชิ้น
                        </Field>
                        {
                            product.type === 'in-stock'
                            ?   <Field>
                                    <VscPackage size={16} style={{margin: '2px 13px 0 0'}} /> 
                                    ลงขายทั้งหมด {product.total} ชิ้น
                                </Field>
                            : product.type === 'pre-order'
                            ?   <Field>
                                    <BiTimeFive size={16} style={{margin: '2px 13px 0 0'}} /> 
                                    {
                                        dayjs().isSameOrBefore(product.until.toDate())
                                        ? `ปิดการขายใน${now.to(product.until.toDate())}`
                                        : `ปิดการขายเมื่อ ${now.to(product.until.toDate())}`
                                    }
                                    <br/>
                                    ( {
                                        dayjs(product.until.toDate()).tz('Asia/Bangkok').locale('th')
                                        .format('D MMM YYYY | HH:mm')
                                    } )
                                </Field>
                            : null
                        }
                        <Separator size={80} margin={{top: 10, bottom: 10}} />
                        <Field>
                            <UserProfile size={16} style={{margin: '2px 13px 0 0'}}
                                src={product.seller.image}
                            />
                            {product.seller.name}
                        </Field>
                        <Field >
                            <AiOutlineHome size={16} style={{margin: '0 13px 0 0'}} />
                            {product.seller.localLocation}
                        </Field>
                        <Cost>ราคา {product.cost} บาท</Cost>
                        <Separator size={100} margin={{top: 30, bottom: 30}} />
                        <ActionSection>
                            <DecButton onClick={handleDecrease} > - </DecButton>
                            {count}
                            <IncButton onClick={handleIncrease} > + </IncButton>
                        </ActionSection>
                        <Button onClick={handleSubmit} disabled={count === 0} >
                            สั่งซื้อ
                        </Button>
                    </Content>
                </>
            ) } 
        </Root>
    )
}

export default Product

const Root = styled.div`
    max-width: 425px;
    width: -webkit-fill-available;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 10px 0 10px;
`
const Content = styled.div`
    position: relative;
    width: -webkit-fill-available;
    padding: 20px 35px;
    margin-top: 25px;
    box-shadow: #a9a9a9b5 0px -5px 10px;
    border-radius: 20px 20px 0 0;
`
const Name = styled.h2`
    margin: 0 0 10px 0;
    color: #545454;
`
const Type = styled.div`
    position: absolute;
    top: 0; right: 0;
    padding: 2px 15px;
    font-size: 14px;
    color: white;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 0px 20px 0px 20px;
`
const Separator = styled.hr`
    width: ${({ size }) => size}%; height: 0px;
    margin: ${({ margin }) => margin.top+'px auto '+margin.bottom+'px auto'};
    border: 0.5px solid #E2E2E2;
`
const Detail = styled.div`
    white-space: pre-line;
    margin-bottom: 20px;
    color: #565656;
    border: 1px solid #E2E2E2;
    padding: 20px;
    border-radius: 15px; 
`
const Field = styled.div`
    color: #4E4E4E;
    margin: 0 0 5px 15px;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
`
const UserProfile = styled.div`
    width: ${({ size }) => size}px; height: ${({ size }) => size}px;
    border-radius: 50%;
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`
const Cost = styled.h2`
    margin: 20px 0;
    text-align: center;
    color: red;
`
const ActionSection = styled.div`
    width: 70%;
    margin: auto; padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 25px;
    border: 1px solid #003DAE;
    border-radius: 15px;
`
const DecButton = styled.button`
    outline: none; user-select: none;
    width: 50px; height: 50px;
    padding: 0; margin-left: -35px;
    text-align: center;
    font-size: 20px;
    color: white; 
    background-color: #003DAE;
    border: 3px solid white;
    border-radius: 50%;
`
const IncButton = styled.button`
    outline: none; user-select: none;
    width: 50px; height: 50px;
    padding: 0; margin-right: -35px;
    text-align: center;
    font-size: 20px;
    color: white;
    background-color: #003DAE;
    border: 3px solid white;
    border-radius: 50%;
`
const Button = styled.button`
    outline: none;
    width: -webkit-fill-available; height: 50px;
    margin: 20px 40px;
    border: none; border-radius: 30px;
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