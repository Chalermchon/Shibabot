import React from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import styled from 'styled-components'
import { DEVICE } from '../../GlobalValue'

const ImageCarousel = ({ images }) => {
    return (
        <Root>
            <ImageGallery
                items={images.map((img) => (
                    { original: img, thumbnail: img }))}
                renderItem={(item) => (
                    <Image src={item.original} />
                )}
                renderThumbInner={(item) => (
                    <Thumbnail src={item.thumbnail} />
                )}
                slideOnThumbnailOver
                showBullets
                showNav={false}
                showFullscreenButton={false}
                showPlayButton={false}
            />
        </Root>
    )
}

export default ImageCarousel

const Root = styled.div`
    width: 100%;
    .image-gallery-thumbnail {
        border: none !important;
        width: fit-content !important;
    }
`
const Image = styled.div`
    width: 300px; height: 300px;
    margin: 0 auto 17px auto;
    border-radius: 30px;
    box-shadow: 0 5px 15px #5D5454CC;
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`
const Thumbnail = styled.div`
    width: 75px; height: 75px;
    margin: 5px;
    border-radius: 10px;
    background-image: url(${({ src }) => src});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center; 
`