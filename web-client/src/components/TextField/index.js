import React, { useState } from 'react'
import styled from 'styled-components'

const TextField = ({
    fullWidth = false, width = 250,
    label, value, handleChange
}) => {
    const [focus, setFocus] = useState(false)
    const [notEmpty, setNotEmpty] = useState(false)

    return (
        <TextFieldRoot width={width} fullWidth={fullWidth} >
            <Label focus={focus} notEmpty={notEmpty} >{label}</Label>
            <Input
                onFocus={() => setFocus(true)} onBlur={()=>setFocus(false)}
                value={value} onChange={(e) => {
                    if (handleChange)
                        handleChange(e)
                    setNotEmpty(e.target.value !== '')
                }}
            />
        </TextFieldRoot>
    )
}

export default TextField

const TextFieldRoot = styled.div`
    width: ${props => props.fullWidth ? '-webkit-fill-available' : props.width+'px'};
    position: relative;
    /* z-index: -1; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 10px;
`
const Input = styled.input`
    outline: none;
    width: -webkit-fill-available;
    position: static;
    padding: 15px 15px;
    border: 1px solid #969696;
    border-radius: 5px;
    color: #555555;
    font-size: 18px; 
    :focus {
        padding: 14px 14px;
        border: 2px solid royalblue;
        border-radius: 5px;
    }
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