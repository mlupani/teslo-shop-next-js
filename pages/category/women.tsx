import type { NextPage } from 'next'
import { Typography } from '@mui/material'
import { useProducts } from '../../hooks'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'

const HomePage: NextPage = () => {
  const { products, isLoading } = useProducts('/products?gender=women')

  return (
    <ShopLayout title={'Teslo-Shop - Women'} pageDescription={'Los mejores productos para Mujeres'}>
        <Typography variant='h1' component={'h1'}>Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Women</Typography>

        {
          isLoading ? <FullScreenLoading/> : <ProductList products={products} />
        }

    </ShopLayout>
  )
}

export default HomePage
