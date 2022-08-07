import type { NextPage, GetServerSideProps } from 'next'
import { Typography } from '@mui/material'
import { dbProducts } from '../../database'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { IProduct } from '../../interfaces'

interface Props {
    products: IProduct[],
    query: string,
    foundProducts: boolean
}
const HomePage: NextPage<Props> = ({ products, query, foundProducts }:Props) => {
  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos en teslo shop'}>
        <Typography variant='h1' component={'h1'}>{!foundProducts ? `No hay resultados para "${query}"` : `Resultados para "${query}"`}</Typography>

        {
            !foundProducts && <Typography variant='h2' sx={{ mb: 1 }}>Podria interesarte: </Typography>
        }
        <ProductList products={products} />

    </ShopLayout>
  )
}

export default HomePage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { q } = params as {q: string}
  let foundProducts = true
  let products = await dbProducts.getProductsBySearch(q)

  if (products.length === 0) {
    foundProducts = false
    products = await dbProducts.getAllProducts()
  }

  return {
    props: {
      products,
      foundProducts,
      query: q
    }
  }
}
