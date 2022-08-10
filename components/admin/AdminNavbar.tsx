import { useContext } from 'react'
import { UIContext } from '../../context'
import NextLink from 'next/link'
import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material'

export const AdminNavbar = () => {
  const { toggleMenu } = useContext(UIContext)

  return (
    <AppBar>
        <Toolbar>
            <NextLink href="/" passHref>
                <Link display="flex" alignItems={'center'}>
                    <Typography variant="h6">Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </Link>
            </NextLink>

            <Box sx={{ flex: 1 }} />

            <Button onClick={toggleMenu}>
                Menu
            </Button>

        </Toolbar>
    </AppBar>
  )
}
