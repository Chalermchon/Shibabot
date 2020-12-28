import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { UserOrderCard } from '../../components'

const Cart = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const neighbors = useSelector(state => state.neighbors)
    const products = useSelector(state => state.products)
    const ordersInGroup = useSelector(state => state.orders)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        dispatch({ type: 'SET_APPBAR', payload: {
            hidden: false,
            title: 'สินค้าที่สั่งซื้อ',
            cartIcon: false,
            sortIcon: true,
        }})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()  => {
        if (user.orders !== undefined && ordersInGroup) {
            setOrders(user.orders.map(orderId => ({...ordersInGroup[orderId], orderId}) ))
        } else {
            setOrders([])
        }
    }, [ordersInGroup, user.orders])

    return (
        <Root>
            {orders.map(order => {
                const product = products[order.category][order.productId]
                const user = neighbors[product.userId]
                return (
                    <UserOrderCard
                        orderId={order.orderId}
                        name={product.name}
                        image={product.images[0]}
                        amount={order.amount}
                        cost={product.cost}
                        createdAt={order.createdAt}
                        user={{
                            name: user.name,
                            image: user.image,
                            localLocation: user.localLocation   
                        }}
                    />
                )
            })}
        </Root>
    )
}

export default Cart

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 70px;
    padding: 10px;
`