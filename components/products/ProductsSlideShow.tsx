import { FC } from 'react'
import { Slide } from 'react-slideshow-image'
import styles from './ProductSlideShow.module.css'
import 'react-slideshow-image/dist/styles.css'

interface Props {
    images: string[];
}

export const ProductsSlideShow:FC<Props> = ({ images }) => {
  return (
        <Slide easing="ease" duration={7000} indicators>
        {images.map((slideImage, index) => {
          const url = `/products/${slideImage}`
          return (
            <div className={styles['each-slide']} key={index}>
            <div style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover' }}></div>
            </div>
          )
        })}
        </Slide>
  )
}
