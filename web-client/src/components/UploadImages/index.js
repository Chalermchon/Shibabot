import React from 'react'
import styled from 'styled-components'

const UploadImages = ({ name, value, handleChange, handleRemoveImage }) => {
    const filesInput = React.useRef(null)

    const handleSelectedImage = () => {
        filesInput.current.click()
    }

    return (
        <div>
            <input type='file' multiple accept="image/x-png,image/jpeg"
                ref={filesInput}
                style={{ display: 'none' }}
                name={name}
                onChange={handleChange}
            />
            <MainSection>
                {
                    value.length
                    ?   <MainImage src={value[0]} >
                            <RemoveButton type='button' onClick={()=>handleRemoveImage(0)} />
                        </MainImage>
                    :   <MainUpload type="button" onClick={handleSelectedImage} >
                            เลือกรูปภาพสินค้า
                        </MainUpload>
                }
            </MainSection>
            <SubSection>
                { 
                    value.map((url, index) => (
                        index !== 0 
                        ?   <SubImage key={`sub-img-${index}`} src={url} >
                               <RemoveButton type='button' onClick={()=>handleRemoveImage(index)} />
                            </SubImage>
                        :   null
                    )) 
                }
                { 
                    value.length 
                    ?   <SubUpload type='button' onClick={handleSelectedImage} >
                            +
                        </SubUpload> 
                    :   null
                }
            </SubSection>

        </div>
    )
}

export default UploadImages

const RemoveButton = styled.button`
    ::before { content: '-' }
    outline: none;
    width: 24px; height: 24px;
    position: absolute;
    top: -8px; right: -8px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: white;
    background-color: red;
    border: 1px solid white;
    border-radius: 50%;
`
const MainSection = styled.div`
    width: 200px; height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px auto 10px auto;
`
const MainUpload = styled.button`
    outline: none;
    width: 100%; height: 100%;
    font-size: 18px;
    color: #717171;
    background-color: inherit;
    border: 1px solid #969696;
    border-radius: 20px;
`
const MainImage = styled.div`
    width: 100%; height: 100%;
    position: relative;
    border: 1px solid #969696;
    border-radius: 20px;
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`
const SubSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 10px;
`
const SubUpload = styled.button`
    outline: none;
    width: 60px; height: 60px;
    margin: 0 5px 10px 5px;
    font-size: 18px;
    color: #717171;
    background-color: inherit;
    border: 1px dashed #969696;
    border-radius: 5px;
`
const SubImage = styled.div`
    width: 60px; height: 60px;
    position: relative;
    margin: 0 5px 10px 5px;
    border: 1px solid #969696;
    border-radius: 5px;
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`