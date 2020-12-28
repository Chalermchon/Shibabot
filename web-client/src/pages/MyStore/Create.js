import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Compress from 'compress.js'
import styled from 'styled-components'
import { DatePicker, Dropdown, TextArea, TextField, UploadImages } from '../../components'
import { groupCol, FieldValue, userCol, storage, Timestamp } from '../../firebase-web'
import { CATEGORIES } from '../../GlobalValue'
import dayjs from 'dayjs'

const Create = () => {
    const compress = new Compress()
    const dispatch = useDispatch()
    const history = useHistory()
    const { alert } = useSelector(state => state.ui)
    const { userId, groupId } = useSelector(state => state.user)
    const [disabled, setDisabled] = useState(true)
    const [product, setProduct] = useState({
        category: '',
        name: '',
        images: [],
        cost: '',
        detail: '',
        type: '',
        until: '',
        total: ''
    })

    const productImageUrls = useMemo(() => (
        product.images.map(image => URL.createObjectURL(image))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [product.images.length])

    useEffect(() => {
        dispatch({ type: 'SET_APPBAR', payload: {
            hidden: false,
            title: 'ลงขายสินค้าใหม่',
            cartIcon: false,
            sortIcon: false,
        }})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setDisabled(
            product.category      === '' ||
            product.name          === '' ||
            product.images.length === 0  ||
            product.cost          === '' ||
            product.type          === '' ||
            (product.type === 'in-stock'  && product.total === '') ||
            (product.type === 'pre-order' && product.until === '')
        )
    }, [product])

    const resizeFile = (files) => {
        return compress.compress(files, {
            quality: 1, 
            maxWidth: 300,
            maxHeight: 300,
        })
    }

    const uploadEachFile = async (file) => {
        const filename = dayjs().format('DD-MM-YY_HH-mm-ss-SSSZZ')
        const format = file.type.split('/').pop()
        return new Promise((resolve, reject) => {
            const task = storage.child(`${groupId}/${filename}.${format}`).put(file)
            task.on('state_changed',
                (snapshot) => {
                    let percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100
                    console.log(filename, percentage)
                },
                (err) => {
                    console.log(`Upload error(${file})`,err)
                    reject(err)
                },
                () => {
                    task.snapshot.ref.getDownloadURL()
                        .then(downloadURL => resolve(downloadURL))
                        .catch((err) => reject(err))
                }
            )
        })
    }
    const uploadAllFiles = async () => {
        const images = await resizeFile(product.images)
        const files = images.map(image => Compress.convertBase64ToFile(image.data, image.ext))
        return Promise.all(
            files.map(async (file) => {
                return await uploadEachFile(file)
            })
        )
    }
    
    const handleChange = ({ target: { name, value, files } }) => {
        setProduct({
            ...product,
            [name]: files ? [ ...product[name], ...files ] : value
        })
    }
    const handleRemoveImage = (index) => {
        setProduct({
            ...product,
            images: [...product.images.slice(0, index), ...product.images.slice(index+1) ]
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch({ type: 'SET_LOADER', payload: {loading: true, animate: true} })
        uploadAllFiles()
            .then(imageUrls => {
                return groupCol.doc(groupId).collection(`Products_${product.category}`).add({
                    category:   product.category,
                    name:       product.name,
                    images:     imageUrls,
                    cost:       parseInt(product.cost),
                    detail:     product.detail.replace(/\n/g, "\\n"),
                    type:       product.type,
                    until:      product.type === 'pre-order' ? new Date(product.until) : null,
                    total:      product.type === 'in-stock'  ? parseInt(product.total) : null,
                    amount:     0,
                    userId:     userId,
                    isActive:   true,
                    createdAt:  Timestamp.now()
                })
            })
            .then((doc) => {
                return userCol.doc(userId).update({
                    products: FieldValue.arrayUnion({
                        productId: doc.id, category: product.category
                    })
                })
            })
            .then(() => {
                dispatch({ type: 'SET_ALERT', payload: {
                    isDisplay: true,
                    type: 'success',
                    title: 'ทำรายการเสร็จสิ้น',
                    description: '',
                    button: {
                        display: true,
                        onClick: (e) => {
                            dispatch({ type: 'SET_ALERT', payload: {isDisplay: false} })
                            history.goBack()
                        }
                    }
                } })
            })
            .catch((err) => {
                console.error(err)
                dispatch({ type: 'SET_ERROR', payload: true })
            })
    }

    return !alert.isDisplay ? (
        <Root autoComplete='off' onSubmit={handleSubmit}  >
            <TextField
                label='ชื่อสินค้า'
                name='name'
                value={product.name}
                handleChange={handleChange}
            />
            <UploadImages 
                name='images'
                value={productImageUrls}
                handleChange={handleChange}
                handleRemoveImage={handleRemoveImage}
            />
            <Dropdown
                label='รูปแบบของสินค้า'
                name='type'
                value={product.type}
                handleChange={handleChange}
                options={[
                    {value: 'in-stock', text: 'พร้อมส่ง'},
                    {value: 'pre-order', text: 'สั่งซื้อล่วงหน้า'},
                ]}
            />
            {
                product.type === 'in-stock'
                ?   <TextField
                        label='จำนวนสินค้า'
                        inputMode='numeric'
                        ignoreReg={/\D/}
                        name='total'
                        value={product.total}
                        handleChange={handleChange}
                    />
                :product.type === 'pre-order'
                ?   <DatePicker
                        label='วันปิดรับออร์เดอร์'
                        name='until'
                        value={product.until}
                        handleChange={handleChange}
                    />
                :   <TextField disabled value='' />
            }
            <Dropdown
                label='หมวดหมู่สินค้า'
                name='category'
                value={product.category}
                handleChange={handleChange}
                options={Object.keys(CATEGORIES).map(category => ({
                    value: category, text: CATEGORIES[category]
                }))}
            /> 
            <TextField
                label='ราคา'
                inputMode='numeric'
                ignoreReg={/\D/}
                name='cost'
                value={product.cost}
                handleChange={handleChange}
            />
            <TextArea
                label='รายละเอียด'
                name='detail'
                value={product.detail}
                handleChange={handleChange}
            />
            <Button disabled={disabled} >
                ลงขาย
            </Button>
        </Root>
    ) : null
}

export default Create

const Root = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 70px;
    padding: 10px;
`
const Button = styled.button`
    outline: none;
    width: 200px; height: 40px;
    margin: 30px 0;
    border: none; border-radius: 20px;
    font-size: 16px;
    color: ${({ disabled }) => disabled ? '#969696' : 'white'};
    background-color: ${({ theme, disabled }) => disabled ? 'transparent' : theme.colors.primary};
    box-shadow: ${({ theme, disabled }) => disabled ? 'none' : '0 2px 3px '+theme.shadows.primary}; 
    transition: all .25s ease-in-out;
    :focus {
        color: ${({ theme }) => theme.colors.primary};
        background-color: white;
        border: 1px solid ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 3px ${({ theme }) => theme.shadows.primary};
    }
`