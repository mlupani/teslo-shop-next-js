import useSWR from 'swr'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Chip, Grid } from '@mui/material'
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { AdminLayout } from '../../components/layouts'
import { IOrder, IUser } from '../../interfaces'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre completo', width: 300 },
  { field: 'total', headerName: 'Monto Total', width: 150, align: 'center' },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    width: 150,
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid
        ? <Chip variant={'outlined'} label={'Pagada'} color={'success'} />
        : <Chip variant={'outlined'} label={'No pagada'} color={'error'} />
    }
  },
  { field: 'NoProducts', headerName: 'No.Products', align: 'center' },
  {
    field: 'check',
    headerName: 'Ver Orden',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target={'_blank'} rel='noreferrer'>
            Ver Orden
        </a>
      )
    }
  },
  { field: 'createdAt', headerName: 'Fecha de creación', width: 300 }
]

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders')

  console.log(data)

  if (!data && !error) return <h1>Loading...</h1>

  if (error) {
    return <h1>failed to load</h1>
  }

  const rows = data!.map(order => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    NoProducts: order.cantItems,
    createdAt: order.createdAt
  }))

  return (
    <AdminLayout
      title={'Ordenes'}
      subTitle={'Estadisticas de las ordenes'}
      icon={<ConfirmationNumberOutlined />}
    >
        <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>

    </AdminLayout>
  )
}

export default OrdersPage
