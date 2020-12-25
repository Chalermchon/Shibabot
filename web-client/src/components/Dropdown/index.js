import React, { useState } from 'react'
import styled from 'styled-components'

const Dropdown = ({
    fullWidth = false, width = 340,
    label, name, value, handleChange, options=[]
}) => {
    const [focus, setFocus] = useState(false)
    const [notEmpty, setNotEmpty] = useState(false)

    return (
        <DropdownRoot width={width} fullWidth={fullWidth} >
            <Label focus={focus} notEmpty={notEmpty} >{label}</Label>
            <Select 
                onFocus={() => setFocus(true)} onBlur={()=>setFocus(false)}
                name={name} value={value} onChange={(e) => {
                    if (handleChange)
                        handleChange(e)
                    setNotEmpty(e.target.value !== '')
                }}
            >
                <option disabled value='' ></option>
                {
                    options.map((option, index) => (
                        <option key={index} value={option.value} >{option.text}</option>
                    ))
                }
            </Select>
        </DropdownRoot>
    )
}

export default Dropdown

const DropdownRoot = styled.div`
    width: ${props => props.fullWidth || props.width > window.innerWidth
        ? '-webkit-fill-available'
        : props.width+'px'
    };
    height: 59px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 10px;
`
const Label = styled.label`
    pointer-events: none;
    position: absolute;
    top: ${props => props.focus || props.notEmpty ? '-10px' : 'auto' };
    margin: 0 10px; padding: 0 5px;
    background-color: white;
    color: ${props => props.focus ? 'royalblue' : '#717171'};
    font-size: ${props => props.focus || props.notEmpty ? 14 : 18 }px;
    transition: all 0.25s;
`
const Select = styled.select`
    outline: none; appearance: none;
    width: 100%; height: 100%;
    padding: 15px;
    font-size: 18px;
    color: #3C3C3C;
    background-color: inherit;
    border: 1px solid #969696;
    border-radius: 5px;
    :focus {
        padding: 14px;
        border: 2px solid royalblue;
        border-radius: 5px;
    }
`