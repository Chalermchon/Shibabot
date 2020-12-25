import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { AiOutlineShoppingCart as CartIcon, MdSort as SortIcon } from 'react-icons/all'

const AppBar = () => {
    const { appBar } = useSelector(state => state.ui)
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset)
    const [visible, setVisible] = useState(false)

    const handleScroll = (event) => {
        const currentScrollPos = window.pageYOffset;
        setVisible(prevScrollPos < currentScrollPos && currentScrollPos > 45)
        setPrevScrollPos(currentScrollPos)
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    })

    const handleClick = () => {
        console.log('Click')
    }

    return (
        <Background visible={visible} >
            <ButtonIcon onClick={handleClick} disabled={!appBar.sortIcon} >
                <SortIcon size={28} />
                <Badge />
            </ButtonIcon>
            <h3>{appBar.title}</h3>
            <ButtonIcon onClick={handleClick} disabled={!appBar.cartIcon} >
                <CartIcon size={28} />
                <Badge visible={true} > 3 </Badge>
            </ButtonIcon>
        </Background>
    )
}

export default AppBar

const Background = styled.div`
    position: fixed;
    z-index: 99;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    top: ${props => props.visible ? '-70px' : '0px'};
    transition: top 300ms ease;
    height: 60px; width: 100%;
    color: #444444;
    background-color: white;
    border-radius: 0px 0px 20px 20px;
    box-shadow: 0px 4px 10px 2px #33333355;
`
const ButtonIcon = styled.button`
    outline: none;
    position: relative;
    width: 40px; height: 40px;
    margin: 0 20px;
    padding: 4px 0;
    border: none;
    border-radius: 50%;
    color: inherit;
    background-color: inherit;
    visibility: ${({ disabled }) => disabled ? 'hidden' : 'visible'};
`
const Badge = styled.span`
    position: absolute;
    top: -4px; right: -4px;
    padding: 1px 6px;
    font-size: 10px;
    border: 2px solid white;
    border-radius: 50%;
    color: white;
    background-color: red;
    visibility: ${({ visible }) => visible ? 'inherit' : 'hidden'};
`