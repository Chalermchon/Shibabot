import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ProductCard } from '../../components'
import { CATEGORIES } from '../../GlobalValue'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

const Products = ({ match }) => {
    const dispatch = useDispatch()
    const { category } = match.params
    const user = useSelector(state => state.user)
    const productsInGroup = useSelector(state => state.products)
    const [products, setProducts] = useState(null)

    useEffect(() => {
        const text = CATEGORIES[category]
        dispatch({ type: 'SET_APPBAR', payload: {
            hidden: false,
            title: text,
            cartIcon: true,
            sortIcon: true,
        }})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (productsInGroup && productsInGroup[category]) {
            const productIds = Object.keys(productsInGroup[category]).filter(id => {
                const product = productsInGroup[category][id]
                return (
                    product.userId !== user.userId && (
                        ( product.type === 'in-stock' && product.amount !== product.total ) ||
                        ( product.type === 'pre-order' && dayjs().isSameOrBefore(product.until.toDate()) )
                    )
                )
            })
            setProducts(productIds.map(id => {
                return {
                    ...productsInGroup[category][id],
                    productId: id
                }
            }))
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsInGroup])

    return (
        <Root>
            {
                !products
                    ?   'loading'
                :products.length !== 0
                    ?   products.map(product => (
                            <CustomLink key={product.productId}
                                to={`${match.url}/${product.productId}`} 
                            >
                                <ProductCard
                                    name={product.name}
                                    image={product.images[0]}
                                    cost={product.cost}
                                    amount={product.amount}
                                    type={product.type}
                                    total={product.total}
                                    until={product.until}
                                />
                            </CustomLink>
                        ))
                    :   'empty'
            }
        </Root>
    )
}

export default Products

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 70px;
    padding: 10px;
`
const CustomLink = styled(Link)`
    text-decoration: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
`