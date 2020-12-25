import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

const Home = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        dispatch({ type: 'SET_APPBAR', payload: {
            title: 'ร้านค้าของฉัน',
            cartIcon: false,
            sortIcon: true,
        }})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Root>
            Home
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
    background-color: #003DAF;
    box-shadow: 0 2px 3px #003DAFAB;
    border: none; border-radius: 32px;
`