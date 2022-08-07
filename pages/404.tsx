import { ShopLayout } from '../components/layouts'
import { Box, Typography } from '@mui/material'

const Custom404 = () => {
  return (
    <ShopLayout title={'Teslo shop'} pageDescription={'Pagina no encontrada'} >
        <Box display={'flex'} sx={{ flexDirection: { xs: 'column', md: 'row' } }} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 200px)'}>
            <Typography variant='h1' component={'h1'} fontSize={80} fontWeight={200}>404 |</Typography>
            <Typography marginLeft={2} fontSize={20}>No encontramos ninguna pagina aqui</Typography>
        </Box>
    </ShopLayout>
  )
}

export default Custom404
