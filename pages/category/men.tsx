import type { NextPage } from 'next'
import { Typography } from '@mui/material'
import { useProducts } from '../../hooks'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'

const HomePage: NextPage = () => {
  const { products, isLoading } = useProducts('/products?gender=men')

  return (
    <ShopLayout title={'Teslo-Shop - Men'} pageDescription={'Los mejores productos para Hombres'}>
        <Typography variant='h1' component={'h1'}>Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Men</Typography>

        {
          isLoading ? <FullScreenLoading/> : <ProductList products={products} />
        }

    </ShopLayout>
  )
}

export default HomePage
