import { FC, useContext } from 'react'
import { Grid, Typography } from '@mui/material'
import { CartContext } from '../../context'
import { transformToCurrency } from '../../utils'

interface Props {
  summaryValues?: {
    cantItems: number
    total: number
    taxRate: number
    subTotal: number
  }
}

export const OrderSummary:FC <Props> = ({ summaryValues }) => {
  const { cantItems, subTotal, taxRate, total } = useContext(CartContext)

  const valuesToShow = summaryValues || { cantItems, subTotal, taxRate, total }

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography display={'flex'} justifyContent={'end'}>{valuesToShow.cantItems} {valuesToShow.cantItems === 1 ? 'Producto' : 'Productos'}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography display={'flex'} justifyContent={'end'}>{transformToCurrency(valuesToShow.subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>IVA ({process.env.NEXT_PUBLIC_TAX_RATE}%)</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography display={'flex'} justifyContent={'end'}>{transformToCurrency(valuesToShow.taxRate)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant={'subtitle1'}>Total</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant={'subtitle1'} display={'flex'} justifyContent={'end'}>{transformToCurrency(valuesToShow.total)}</Typography>
      </Grid>

    </Grid>
  )
}
