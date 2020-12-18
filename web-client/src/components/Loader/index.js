import React from 'react'
import { useSelector } from 'react-redux'
import styled, {keyframes} from 'styled-components'

const Loader = () => {
    const { loader: {loading, animate} } = useSelector(state => state.ui)

    return ( 
        loading
        ?   <Root>
                <Background animate={animate} >
                    <Ring />
                </Background>
            </Root>
        :   null
    )
}

export default Loader

const rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`
const scale = keyframes`
    0% {
        width: 64px; height: 64px;
        border-radius: 50%;
        background-color: transparent;
    }
    100% {
        width: 100%; height: 100%;
        border-radius: 50%;
        background-color: white;
    }
`
const Root = styled.div`
    width: -webkit-fill-available; height: -webkit-fill-available;
    position: fixed;
    z-index: 99;
    display: flex; 
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: transparent;
`
const Background = styled.div`
    width: 100%; height: 100%;
    display: flex; 
    flex-direction: column;
    justify-content: center;
    align-items: center; 
    background-color: white;
    animation: ${scale} 0.5s ease-in-out ${({ animate }) => animate ? 1 : 0};
`
const Ring = styled.div`
    width: 64px; height: 64px;
    border-width: 8px;
    border-style: solid;
    border-color:   ${({ theme }) => theme.colors.primary}
                    ${({ theme }) => theme.colors.primary}
                    ${({ theme }) => theme.colors.primary}
                    transparent;
    border-radius: 50%;
    animation: ${rotate} 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`
