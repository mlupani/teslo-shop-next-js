import { Box, Button } from '@mui/material'
import { FC } from 'react'
import { Isize } from '../../interfaces'

interface Props {
    selectedSize?: Isize
    sizes: Isize[],
    handleSelectSize: (size: Isize) => void
}

export const SizeSelector:FC<Props> = ({ selectedSize, sizes, handleSelectSize }) => {
  return (
    <Box>
        {
            sizes.map(size => (
                <Button
                    key={size}
                    size='small'
                    color={selectedSize === size ? 'primary' : 'info'}
                    onClick={() => handleSelectSize(size)}
                >
                    {size}
                </Button>
            ))
        }
    </Box>
  )
}
