import React, { useState } from 'react'
import styled from 'styled-components'

const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

const DatePicker = ({
    fullWidth = false, width = 340,
    label, name, value, handleChange
}) => {
    const [focus, setFocus] = useState(false)
    const [notEmpty, setNotEmpty] = useState(value !== '')

    const dateObject = new Date(value)
    const today = new Date()
    const date = dateObject.getDate()
    const month = TH_MONTHS[dateObject.getMonth()]
    const year = dateObject.getFullYear() + 543
    const hours = dateObject.getHours()
    const minutes = dateObject.getMinutes()

    return (
        <DatePickerRoot width={width} fullWidth={fullWidth} >
            <Label focus={focus} notEmpty={notEmpty} >{label}</Label>
            <ValueDisplay>
                {
                    value 
                    ? `${date} ${month} ${year} - ${hours < 10 ? '0'+hours : hours}:${minutes < 10 ? '0'+minutes : minutes}` 
                    : ''
                }
            </ValueDisplay>
            <Input
                type='datetime-local' 
                min={`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}T00:00`}
                onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                name={name} value={value} onChange={(e) => {
                    if (handleChange)
                        handleChange(e)
                    setNotEmpty(e.target.value !== '')
                }}
            />
        </DatePickerRoot>
    )
}

export default DatePicker

const DatePickerRoot = styled.div`
    width: ${props => props.fullWidth || props.width > window.innerWidth
        ? '-webkit-fill-available'
        : props.width + 'px'
    };
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 10px;
`
const Input = styled.input`
    outline: none; appearance: none;
    width: -webkit-fill-available;
    height: 57px;
    position: static;
    color: white;
    background: inherit;
    border: 1px solid #969696;
    border-radius: 5px;
    :focus {
        height: 56px;
        border: 2px solid royalblue;
        border-radius: 5px;
    }
    ::-webkit-calendar-picker-indicator {
        width: 100%; height: 100%;
        margin: unset;
        background: inherit;
    }
`
const ValueDisplay = styled.div`
    pointer-events: none;
    position: absolute;
    top: calc(50% - (27px / 2)); left: 0;
    padding: 0 15px;
    color: #3C3C3C;
    font-size: 18px;
`
const Label = styled.label`
    pointer-events: none;
    position: absolute;
    top: ${props => props.focus || props.notEmpty ? '-10px' : 'auto'};
    margin: 0 10px; padding: 0 5px;
    background-color: white;
    color: ${props => props.focus ? 'royalblue' : '#717171'};
    font-size: ${props => props.focus || props.notEmpty ? 14 : 18}px;
    transition: all 0.25s;
`