import { FC } from 'react'
import { AddCircleOutlined, RemoveCircleOutlined } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'

interface Props {
  currentValue: number
  updateQuantity: (value: number) => void
  maxValue: number
}

export const ItemCounter:FC<Props> = ({ currentValue, updateQuantity, maxValue }) => {
  const handleUpdate = (value: number) => {
    if (currentValue + value > maxValue || currentValue + value <= 0) return
    updateQuantity(value)
  }
  return (
    <Box display={'flex'} alignItems={'center'}>
        <IconButton onClick={() => handleUpdate(-1)}>
            <RemoveCircleOutlined/>
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
        <IconButton onClick={() => handleUpdate(+1)}>
            <AddCircleOutlined/>
        </IconButton>
    </Box>
  )
}
