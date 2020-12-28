import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import FoodsAndDrinksImg from '../../utils/foods-n-drinks.jpg'
import BooksImg from '../../utils/books.jpg'
import ToolsImg from '../../utils/tools.jpg'
import CostumesImg from '../../utils/costumes.jpg'

const Home = ({ match }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({ type: 'SET_APPBAR', payload: {
            hidden: false,
            title: 'หมวดหมู่',
            cartIcon: true,
            sortIcon: true,
        }})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Root>
            <Row width={450} height={175} >
                <CustomLink to={`${match.url}/foods-n-drinks`} >
                    <Image src={FoodsAndDrinksImg} color='#679793' />
                </CustomLink>
            </Row>
            <Row width={450} height={150} >
                <CustomLink to={`${match.url}/books`} >
                    <Image src={BooksImg} color='#4398DA' />
                </CustomLink>
                <CustomLink to={`${match.url}/tools`} >
                    <Image src={ToolsImg} color='#8577FE' />
                </CustomLink>
            </Row>
            <Row  width={450} height={175} >
                <CustomLink to={`${match.url}/costumes`} >
                    <Image src={CostumesImg} color='#C383FE' />
                </CustomLink>
            </Row>
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
const Row = styled.div`
    @media (max-width: ${({ width }) => width}px) {
        width: -webkit-fill-available;
    }
    @media (min-width: ${({ width }) => width}px) {
        width: ${({ width }) => width}px;
    }
    height: ${({ height }) => height}px;
    margin: 4px;
    display: flex;
    flex-direction: row;
`
const CustomLink = styled(Link)`
    width: 100%; height: 100%;
    margin: 4px;
    text-decoration: none;
`
const Image = styled.div`
    width: 100%; height: 100%;
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: ${({ color }) => color};
    border-radius: 20px;
    box-shadow: 0px 5px 10px #B4B4B4;
`