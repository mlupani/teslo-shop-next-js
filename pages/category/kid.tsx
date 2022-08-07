import type { NextPage } from 'next'
import { Typography } from '@mui/material'
import { useProducts } from '../../hooks'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'

const HomePage: NextPage = () => {
  const { products, isLoading } = useProducts('/products?gender=kid')

  return (
    <ShopLayout title={'Teslo-Shop - Kid'} pageDescription={'Los mejores productos para niños'}>
        <Typography variant='h1' component={'h1'}>Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Kid</Typography>

        {
          isLoading ? <FullScreenLoading/> : <ProductList products={products} />
        }

    </ShopLayout>
  )
}

export default HomePage
