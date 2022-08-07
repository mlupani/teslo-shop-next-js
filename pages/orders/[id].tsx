import { GetServerSideProps, NextPage } from 'next'
import { isValidObjectId } from 'mongoose'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { Card, CardContent, Grid, Typography, Divider, Box, Link, Chip, CircularProgress } from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import NextLink from 'next/link'
import { CreditCardOffOutlined, CreditCardOutlined } from '@mui/icons-material'
import { Order } from '../../models'
import { getSession } from 'next-auth/react'
import { IOrder } from '../../interfaces/'
import { tesloApi } from '../../api'
import { useRouter } from 'next/router'
import { useState } from 'react'

export type OrderResponseBody = {
  id: string;
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
}

interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }: Props) => {
  const { shippingAddress } = order
  const router = useRouter()
  const [isPaying, setIsPaying] = useState(false)

  const orderComplete = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('No hay pago en paypal')
    }

    setIsPaying(true)

    try {
      await tesloApi.post('/orders/pay', {
        orderId: order._id,
        transactionId: details.id
      })
      router.reload()
    } catch (error) {
      setIsPaying(false)
      console.log(error)
      alert(error)
    }
  }

  return (
    <ShopLayout title={`Orden: ${order._id}`} pageDescription={'Orden'}>
        <Typography variant='h1' component='h1'>Orden: {order._id} </Typography>

        {
          order.isPaid
            ? <Chip sx={{ my: 2 }} label='Orden pagada' variant='outlined' color='success' icon={<CreditCardOutlined/>} />
            : <Chip sx={{ my: 2 }} label='Pendiente de pago' variant='outlined' color='error' icon={<CreditCardOffOutlined/>} />
        }

        <Grid container className='fadeIn'>

            <Grid item xs={12} sm={5}>
                <CartList products={order.orderItems} />
            </Grid>

            <Grid item xs={12} sm={7}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2' component='h2'>Resumen ({order.cantItems} {order.cantItems > 1 ? 'productos' : 'producto'} )</Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box display={'flex'} justifyContent='space-between'>
                            <Typography fontWeight={600} variant='h6' component='h6'>Direccion de entrega</Typography>
                            <NextLink href='/checkout/address' passHref>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <Typography variant='body1' component='p'>{shippingAddress.firstName} {shippingAddress.lastName} </Typography>
                        <Typography variant='body1' component='p'>{shippingAddress.address} {shippingAddress.address2}</Typography>
                        <Typography variant='body1' component='p'>{shippingAddress.city} {shippingAddress.zip} </Typography>
                        <Typography variant='body1' component='p'>{shippingAddress.country}</Typography>
                        <Typography variant='body1' component='p'>{shippingAddress.phone}</Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box display={'flex'} justifyContent='end'>
                            <NextLink href='/cart' passHref>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <OrderSummary summaryValues={{ total: order.total, subTotal: order.subTotal, taxRate: order.taxRate, cantItems: order.cantItems }} />

                        <Box display={isPaying ? 'flex' : 'none'} className='fadeIn' justifyContent={'center'} >
                          <CircularProgress/>
                        </Box>

                        <Box display={isPaying ? 'none' : 'flex'} className='fadeIn' flexDirection={'column'}>
                          {
                            order.isPaid
                              ? <Chip sx={{ my: 2, display: 'flex', flexDirection: 'row' }} label='Orden pagada' variant='outlined' color='success' icon={<CreditCardOutlined/>} />
                              : (
                                <Box sx={{ mt: 3 }}>
                                    <PayPalButtons
                                      createOrder={(data, actions) => {
                                        return actions.order.create({
                                          purchase_units: [
                                            {
                                              amount: {
                                                value: order.total.toString()
                                              }
                                            }
                                          ]
                                        })
                                      }}
                                    onApprove={(data, actions) => {
                                      return actions.order!.capture().then((details) => {
                                        orderComplete(details)
                                        // console.log(details)
                                        // const name = details.payer.name.given_name
                                        // alert(`Transaction completed by ${name}`)
                                      })
                                    }}
                                    />
                                </Box>
                                )
                          }
                        </Box>

                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </ShopLayout>
  )
}

export default OrderPage

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const orderId = query.id || ''
  const session: any = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${orderId}`,
        permanent: false
      }
    }
  }

  if (!isValidObjectId(orderId)) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false
      }
    }
  }

  let order = await Order.findById(orderId)
  order = JSON.parse(JSON.stringify(order))

  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false
      }
    }
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false
      }
    }
  }

  return {
    props: {
      order
    }
  }
}
