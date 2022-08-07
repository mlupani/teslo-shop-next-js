import NextLink from 'next/link'
import { GetServerSideProps } from 'next'
import { Button, Chip, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { ShopLayout } from '../../components/layouts'
import { getSession } from 'next-auth/react'
import { Order } from '../../models'
import { FC } from 'react'
import { IOrder } from '../../interfaces'

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 300
  },
  {
    field: 'paid',
    headerName: 'Pagada',
    width: 200,
    description: 'esta es la informacion si esta pagada o no',
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? <Chip label='Pagada' color='success' variant='outlined' /> : <Chip color='error' label='No Pagada' variant='outlined' />
    }
  },
  {
    field: 'orden',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return <NextLink href={`/orders/${params.row._id}`} passHref><Link><Button className='circular-btn' color='secondary'>Ver Orden</Button></Link></NextLink>
    }
  }
]

interface Props {
  orders: IOrder[]
}

const historyPage: FC <Props> = ({ orders }) => {
  const rows = orders.map(({ shippingAddress, isPaid, _id }, index) => ({ id: index + 1, name: `${shippingAddress.firstName} ${shippingAddress.lastName}`, paid: isPaid, _id }))
  return (
    <ShopLayout title={'Historial de ordenes'} pageDescription={'esta es el historial de ordenes'} >
        <h1>Historial de ordenes</h1>
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default historyPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false
      }
    }
  }

  const orders = await Order.find({ user: session.user._id }).sort({ createdAt: -1 })

  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders))
    }
  }
}
