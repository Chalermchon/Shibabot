import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { ProductCard } from '../../components'
import { CATEGORIES } from '../../GlobalValue'

const Home = ({ match }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const user = useSelector(state => state.user)
    const products = useSelector(state => state.products)
    const [userProducts, setUserProducts] = useState(null)

    useEffect(() => {
        dispatch({ type: 'SET_APPBAR', payload: {
            hidden: false,
            title: 'ร้านค้าของฉัน',
            cartIcon: false,
            sortIcon: true,
        }})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isProductsFetched = () => {
        const categories = Object.keys(CATEGORIES)
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i]
            if (products[category] === null) {
                return false
            }
        }
        return true
    }

    useEffect(() => {
        if (user.isFriend) {
            if (user.products) {
                if (products && isProductsFetched()) {
                    setUserProducts(
                        user.products
                        .filter(product => products[product.category][product.productId].isActive)
                        .map(product => ({
                            ...products[product.category][product.productId],
                            productId: product.productId
                        }))
                    )
                }
            } else {
                setUserProducts([])
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, user])

    return (
        <Root>
            {
                userProducts
                ?   userProducts.length !== 0
                    ?   userProducts.map(product => (
                            <CustomLink key={product.productId}
                                to={`${match.url}/product/${product.category}/${product.productId}`} 
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
                    :   'Empty'
                : 'loading'
            }
            <AddButton onClick={() => history.push('/my-store/create') } />
        </Root>
    )
}

export default Home

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
const AddButton = styled.button`
    ::before {content: "+"}
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    bottom: 20px; right: 20px;
    width: 64px; height: 64px;
    padding-bottom: 3px;
    font-size: 32px;
    color: white;
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 3px ${({ theme }) => theme.shadows.primary};
    border: none; border-radius: 32px;
`