import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { AttachMoneyOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material'
import { Grid } from '@mui/material'
import { AdminLayout } from '../../components/layouts'
import SummaryTile from '../../components/admin/SummaryTile'
import { DashboardInfo } from '../../interfaces'

const DashboardPage = () => {
  const { error, data } = useSWR<DashboardInfo>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000
  })
  const [refresh, setRefresh] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => setRefresh(refresh => refresh > 0 ? refresh - 1 : 30), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!data && !error) return <h1>Loading...</h1>

  if (error) {
    return <h1>failed to load</h1>
  }

  const { numberOfOrders, paidOrders, notPaidOrders, numberOfClients, numberOfProducts, productsWithNoInventory, lowInventory } = data!

  return (
    <AdminLayout
      title={'Dashboard'}
      subTitle={'Estadisticas generales'}
      icon={<DashboardOutlined />}
    >

      <Grid container spacing={2}>
        <SummaryTile title={numberOfOrders} subTitle={'Ordenes totales'} icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={paidOrders} subTitle={'Ordenes pagadas'} icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={notPaidOrders} subTitle={'Ordenes pendientes'} icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={numberOfClients} subTitle={'Clientes'} icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={numberOfProducts} subTitle={'Productos'} icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={productsWithNoInventory} subTitle={'Productos sin existencias'} icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={lowInventory} subTitle={'Productos bajo inventario'} icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={refresh} subTitle={'Actualizacion en: '} icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />} />
      </Grid>

    </AdminLayout>
  )
}

export default DashboardPage
