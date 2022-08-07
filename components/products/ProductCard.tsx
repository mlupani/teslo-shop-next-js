import { FC, useMemo, useState } from 'react'
import NextLink from 'next/link'
import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link, Chip } from '@mui/material'
import { IProduct } from '../../interfaces'

interface Props {
    product: IProduct;
}

export const ProductCard:FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const productImage = useMemo(() => isHovered ? '/products/' + product.images[1] : '/products/' + product.images[0], [isHovered, product.images])

  return (
    <Grid item xs={12} sm={6} md={4} key={product.slug} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
          <Link>
            <Card>
            <CardActionArea>
                {
                  product.inStock === 0 &&
                    <Chip label={'No hay disponibles'} color='primary' sx={{ position: 'absolute', zIndex: 99, top: 10, left: 10 }} />
                }
                <CardMedia
                  component={'img'}
                  className='fadeIn'
                  image={productImage}
                  alt={product.description}
                  onLoad={() => setIsImageLoaded(true)}
                />
            </CardActionArea>
            </Card>
          </Link>
        </NextLink>

        <Box sx={{ display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
            <Typography fontWeight={800}>{product.title}</Typography>
            <Typography fontWeight={500}>${product.price}</Typography>
        </Box>
    </Grid>
  )
}
