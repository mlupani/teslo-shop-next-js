import { useContext, useState } from 'react'
import { CartContext, UIContext } from '../../context'
import NextLink from 'next/link'
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material'
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'

export const Navbar = () => {
  const router = useRouter()
  const { cantItems } = useContext(CartContext)
  const { toggleMenu } = useContext(UIContext)
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const [search, setSearch] = useState('')

  const handleSearch = () => {
    if (search.trim().length === 0) return
    router.push(`/search/${search}`)
  }

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

            <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }} className='fadeIn'>
                <NextLink href="/category/men" passHref>
                    <Link>
                        <Button color={router.asPath === '/category/men' ? 'primary' : 'info' } >Hombres</Button>
                    </Link>
                </NextLink>
                <NextLink href="/category/women" passHref>
                    <Link>
                        <Button color={router.asPath === '/category/women' ? 'primary' : 'info' }>Mujeres</Button>
                    </Link>
                </NextLink>
                <NextLink href="/category/kid" passHref>
                    <Link>
                        <Button color={router.asPath === '/category/kid' ? 'primary' : 'info' }>Niños</Button>
                    </Link>
                </NextLink>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* pantallas grandes */}

                {
                    isSearchVisible
                      ? <Input
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                            className='fadeIn'
                            autoFocus={true}
                            inputProps={{ autoFocus: true }}
                            value={search}
                            type='text'
                            placeholder="Buscar..."
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setIsSearchVisible(false)}
                                    >
                                    <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                      : <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }} className='fadeIn' onClick={() => setIsSearchVisible(true)}>
                            <SearchOutlined/>
                        </IconButton>
                }

            {/* pantallas pequeñas */}
            <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={toggleMenu}>
                <SearchOutlined/>
            </IconButton>

            <NextLink href='/cart' passHref>
                <Link>
                    <IconButton>
                        <Badge badgeContent={cantItems} color='secondary' >
                            <ShoppingCartOutlined/>
                        </Badge>
                    </IconButton>
                </Link>
            </NextLink>

            <Button onClick={toggleMenu}>
                Menu
            </Button>

        </Toolbar>
    </AppBar>
  )
}
