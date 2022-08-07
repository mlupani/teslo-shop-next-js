import NextLink from 'next/link'
import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'
import { ShopLayout } from '../../components/layouts'

const emptyPage = () => {
  return (
    <ShopLayout title={'Teslo shop'} pageDescription={'Pagina cuando el carrito de compras esta vacio'} >
        <Box display={'flex'} sx={{ flexDirection: { xs: 'column', md: 'row' } }} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 200px)'}>
            <Box display={'flex'} justifyContent='center' alignItems={'center'} >
                <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
                <Box sx={{ marginLeft: 2 }}>
                    <Typography fontSize={20}>Su carito esta vacio</Typography>
                    <NextLink href='/' passHref>
                        <Link color='secondary' typography={'h4'}>
                            Regresar
                        </Link>
                    </NextLink>
                </Box>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default emptyPage
