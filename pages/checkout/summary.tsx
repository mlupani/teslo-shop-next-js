import { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { CartContext } from '../../context/cart/CartContext'
import { Card, CardContent, Grid, Typography, Divider, Box, Button, Link, Chip } from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import Cookies from 'js-cookie'
import { countries } from '../../utils/countries'

const SummaryPage = () => {
  const { shippingAddress, cantItems, createOrder } = useContext(CartContext)
  const router = useRouter()
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!Cookies.get('addressForm')) {
      router.push('/checkout/address')
    }
  }, [])

  const confirmOrder = async () => {
    setIsPosting(true)
    const { hasError, message } = await createOrder()
    if (hasError) {
      setIsPosting(false)
      setError(message)
      return
    }

    router.replace(`/orders/${message}`)
  }

  return (
    <ShopLayout title={'Resumen de la orden'} pageDescription={'Orden a confirmar'}>
        <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

        <Grid container>

            <Grid item xs={12} sm={5}>
                <CartList/>
            </Grid>

            <Grid item xs={12} sm={7}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2' component='h2'>Resumen ({cantItems} {cantItems === 1 ? 'Producto' : 'Productos'})</Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box display={'flex'} justifyContent='space-between'>
                            <Typography fontWeight={600} variant='h6' component='h6'>Direccion de entrega</Typography>
                            <NextLink href='/checkout/address' passHref>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <Typography variant='body1' component='p'>{shippingAddress?.firstName + '' + shippingAddress?.lastName}</Typography>
                        <Typography variant='body1' component='p'>{shippingAddress?.address}, {shippingAddress?.address2 ? shippingAddress?.address2 : ''}</Typography>
                        <Typography variant='body1' component='p'>{shippingAddress?.city}</Typography>
                        <Typography variant='body1' component='p'>{countries.find(c => c.code === shippingAddress?.country)?.name}</Typography>
                        <Typography variant='body1' component='p'>{shippingAddress?.phone}</Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box display={'flex'} justifyContent='end'>
                            <NextLink href='/cart' passHref>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <OrderSummary/>

                        <Box sx={{ mt: 3 }} display={'flex'} flexDirection={'column'}>
                            <Button color='secondary' className='circular-btn' fullWidth onClick={ confirmOrder } disabled={isPosting} >
                                Confirmar orden
                            </Button>

                            <Chip color='error' label={error} sx={{ display: error ? 'flex' : 'none', mt: 3 }} />
                        </Box>

                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage
