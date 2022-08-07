import { FC, useContext } from 'react'
import NextLink from 'next/link'
import { Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material'
import { CartContext } from '../../context'
import { ItemCounter } from '../ui/ItemCounter'
import { IProductCart, IOrderItem } from '../../interfaces'

interface Props {
    editable?: boolean
    products?: IOrderItem[]
}

export const CartList:FC<Props> = ({ editable = false, products = [] }) => {
  const { cart, addProduct, removeProduct } = useContext(CartContext)

  const handleQuantity = (value: number, product: IProductCart) => {
    const newProduct = { ...product, quantity: value }
    addProduct(newProduct)
  }

  const productsToShow = products || cart

  return (
    <>
        {productsToShow.map(product => (
            <Grid spacing={2} key={product.slug + product.size} container sx={{ mb: 1 }}>
                <Grid item xs={3} >
                    <NextLink href={`/product/${product.slug}`} passHref>
                        <Link>
                            <CardActionArea>
                                <CardMedia image={`/products/${product.image}`} component={'img'} sx={{ borderRadius: '5px' }} />
                            </CardActionArea>
                        </Link>
                    </NextLink>
                </Grid>
                <Grid item xs={7} >
                    <Typography variant='h5' component='h5'>{product.title}</Typography>
                    <Typography variant='body1' component='p'>Talla: <strong>{product?.size}</strong></Typography>
                    {
                        editable
                          ? <ItemCounter currentValue={product.quantity} updateQuantity={(newValue) => handleQuantity(newValue, product as IProductCart)} maxValue={10}/>
                          : <Typography variant='h6'>{product.quantity} items</Typography>
                    }
                </Grid>
                <Grid item xs={2} >
                    <Typography variant='h5' component='h5'>$ {product.price}</Typography>
                    {editable && (
                        <Button onClick={() => removeProduct(product as IProductCart)} variant={'text'} color={'secondary'}>
                            Remove
                        </Button>
                    )}
                </Grid>
            </Grid>
        ))}
    </>
  )
}
