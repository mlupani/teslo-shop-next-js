import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { UIContext, AuthContext } from '../../context'
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material'

export const SideMenu = () => {
  const { user, isLoggedIn, onLogout } = useContext(AuthContext)
  const { isMenuOpen, toggleMenu } = useContext(UIContext)
  const router = useRouter()
  const [search, setSearch] = useState('')

  const handleSearch = () => {
    if (search.trim().length === 0) return
    navigateTo(`/search/${search}`)
  }

  const navigateTo = (url: string) => {
    toggleMenu()
    router.push(url)
  }

  return (
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        onClose={toggleMenu}
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>

            <List>

                <ListItem>
                    <Input
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
                                    onClick={handleSearch}
                                >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>

                {
                    isLoggedIn &&
                        <ListItem button>
                            <ListItemIcon>
                                <AccountCircleOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Perfil'} />
                        </ListItem>
                }

                {
                    isLoggedIn &&
                        <ListItem button onClick={() => navigateTo('/orders/history')}>
                            <ListItemIcon>
                                <ConfirmationNumberOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Mis Ordenes'} />
                        </ListItem>
                }

                <ListItem onClick={() => navigateTo('/category/men')} button sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItem>

                <ListItem onClick={() => navigateTo('/category/women')} button sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem onClick={() => navigateTo('/category/kid')} button sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItem>

                {
                    !isLoggedIn
                      ? <ListItem button onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItem>
                      : <ListItem button onClick={onLogout}>
                        <ListItemIcon>
                            <LoginOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Salir'} />
                    </ListItem>
                }

                {/* Admin */}
                <Divider />
                {
                    isLoggedIn && user?.role === 'admin' &&
                    <>
                        <ListSubheader>Admin Panel</ListSubheader>

                        <ListItem button onClick={() => navigateTo('/admin')} >
                            <ListItemIcon>
                                <DashboardOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Dashboard'} />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                                <CategoryOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Productos'} />
                        </ListItem>
                        <ListItem button onClick={() => navigateTo('/admin/orders')}>
                            <ListItemIcon>
                                <ConfirmationNumberOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ordenes'} />
                        </ListItem>

                        <ListItem button onClick={() => navigateTo('/admin/users')}>
                            <ListItemIcon>
                                <AdminPanelSettings/>
                            </ListItemIcon>
                            <ListItemText primary={'Usuarios'} />
                        </ListItem>
                    </>
                }
            </List>
        </Box>
    </Drawer>
  )
}
