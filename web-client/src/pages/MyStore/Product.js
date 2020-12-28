import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { ProductCard, ProductOrderCard } from '../../components'

const Product = ({ match }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { category, productId } = match.params
    const productsInGroup = useSelector(state => state.products)
    const ordersInGroup = useSelector(state => state.orders)
    const neighbors = useSelector(state => state.neighbors)
    const [product, setProduct] = useState(null)
    const [orders, setOrders] = useState(null)

    useEffect(() => {
        dispatch({ type: 'SET_APPBAR', payload: { hidden: true }})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (productsInGroup && productsInGroup[category] && ordersInGroup && neighbors) {
            const prod = productsInGroup[category][productId]
            if (!prod.isActive) {
                history.goBack()
            }else if (prod !== undefined) {
                setProduct({ ...prod, productId })
                if (prod.orders) {
                    setOrders(prod.orders.map(orderId => {
                        const order = ordersInGroup[orderId]
                        const user = neighbors[order.userId]
                        return {
                            orderId: orderId,
                            user: {
                                name: user.name,
                                image: user.image,
                                localLocation: user.localLocation
                            },
                            amount: order.amount,
                            createdAt: order.createdAt
                        }
                    }))
                } else {
                    setOrders([])
                }
            } else {
                dispatch({ type: 'SET_ALERT', payload: {
                    isDisplay: true,
                    type: 'warning',
                    title: 'ไม่พบสินค้าดังกล่าว',
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
    }, [category, neighbors, ordersInGroup, productId, productsInGroup])

    return product ? (
        <Root>
            <ProductCard
                name={product.name}
                image={product.images[0]}
                cost={product.cost}
                amount={product.amount}
                type={product.type}
                total={product.total}
                until={product.until}
            />
            <Seperator size={90} margin={15} />
            {
                orders
                ?   orders.map(order => (
                        <ProductOrderCard 
                            key={order.orderId}
                            orderId={order.orderId}
                            user={order.user}
                            amount={order.amount}
                            totalCost={product.cost * order.amount}
                            createdAt={order.createdAt}
                        />
                    ))
                :   'loading'
            }
        </Root>
    ) : null
}

export default Product

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 10px;
`
const Seperator = styled.hr`
    width: 90%; height: 0px;
    margin: 15px 0;
    border: 0.25px solid #DEDEDEB5;
`