import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { MdError } from 'react-icons/md'

const ErrorDisplay = () => {
    const { error: {isError, title, description} } = useSelector(state => state.ui)

    return ( 
        isError
        ?   <Root>
                <MdError color="red" size="100" />
                <Title>{title}</Title>
                <Description>{description}</Description>
            </Root>
        :   null
    )
}

export default ErrorDisplay

const Root = styled.div`
    width: -webkit-fill-available; height: -webkit-fill-available;
    position: fixed;
    z-index: 99;
    display: flex; 
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
`
const Title = styled.h1`
    margin-bottom: 5px;
    text-align: center;
    color: #5F5F5F;
`
const Description = styled.h3`
    margin: unset;
    text-align: center;
    color: #797979;
`