import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { MdError, AiFillWarning, IoIosCheckmarkCircle } from 'react-icons/all'

const Alert = () => {
    const { alert: {isDisplay, type, title, description, button} } = useSelector(state => state.ui)

    return ( 
        isDisplay
        ?   <Root>
                {
                    type === 'error'
                        ? <MdError color="red" size="100" />
                    :type === 'warning'
                        ? <AiFillWarning color="darkorange" size="100" />
                    :type === 'success'
                        ? <IoIosCheckmarkCircle color="green" size="100" />
                    : null
                }
                <Title>{title}</Title>
                <Description>{description}</Description>
                {
                    button.display
                    ? <Button type={type} onClick={button.onClick} >ตกลง</Button>
                    : null
                }
            </Root>
        :   null
    )
}

export default Alert

const Root = styled.div`
    width: -webkit-fill-available; height: -webkit-fill-available;
    position: fixed;
    z-index: 999;
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
const Button = styled.button`
    outline: none;
    width: 200px; height: 40px;
    margin: 30px 0;
    border: 2px solid ${({ theme, type }) => theme.colors[type]};;
    border-radius: 20px;
    font-size: 16px;
    color: ${({ theme, type }) => theme.colors[type]};;
    background-color: white;
    box-shadow: none;
`