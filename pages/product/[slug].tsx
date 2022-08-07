import { useContext, useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { dbProducts } from '../../database'
import { ProductsSlideShow, SizeSelector } from '../../components/products'
import { ItemCounter } from '../../components/ui'
import { IProduct, IProductCart, Isize } from '../../interfaces'
import { ShopLayout } from '../../components/layouts'
import { CartContext } from '../../context'

interface Props {
    product: IProduct
}

const SlugPage = ({ product }: Props) => {
  const router = useRouter()
  const { addProduct } = useContext(CartContext)
  const [tempCartProduct, setTempCartProduct] = useState<IProductCart>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1
  })

  const handleSelectSize = (size: Isize) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      size
    }))
  }

  const handleQuantity = (value: number) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      quantity: tempCartProduct.quantity + value
    }))
  }

  const addProductToCart = () => {
    if (!tempCartProduct.size) return
    addProduct(tempCartProduct)
    router.push('/cart')
  }

  return (
    <ShopLayout title={product.slug} pageDescription={'Descripcion'}>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
                <ProductsSlideShow images={product.images} />
            </Grid>

            <Grid item xs={12} sm={5}>
                <Box display={'flex'} flexDirection={'column'}>
                    <Typography variant={'h1'} component={'h1'}>{product.title}</Typography>
                    <Typography variant={'subtitle2'} component={'h2'}>${product.price}</Typography>

                    <Box sx={{ my: 2 }}>
                        <Typography variant={'subtitle2'}>Cantidad</Typography>
                        <ItemCounter currentValue={tempCartProduct.quantity} updateQuantity={handleQuantity} maxValue={product.inStock} />
                        <SizeSelector
                          selectedSize={tempCartProduct.size}
                          sizes={product.sizes}
                          handleSelectSize={handleSelectSize} />
                    </Box>

                    {
                        product.inStock === 0
                          ? <Chip label={'No hay disponibles'} color={'error'} variant={'outlined'} />
                          : <Button onClick={addProductToCart} color={'secondary'} className='circular-btn'>
                              {
                                tempCartProduct.size
                                  ? 'Agregar al carrito'
                                  : 'Debe seleccionar una talla'
                              }
                          </Button>
                    }

                    <Box sx={{ my: 3 }}>
                        <Typography variant={'subtitle2'}>Descripción</Typography>
                        <Typography variant={'body2'}>{product.description}</Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SlugPage

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductSlugs()

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug
  let product = null
  if (slug) product = await dbProducts.getProductBySlug(slug.toString())

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24
  }
}

/*
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug
  let product = null
  if (slug) product = await dbProducts.getProductBySlug(slug.toString())

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    }
  }
}
*/
