import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { GroupOutlined } from '@mui/icons-material'
import { Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { tesloApi } from '../../api'
import { AdminLayout } from '../../components/layouts'
import { IUser } from '../../interfaces'

const Users = () => {
  const { error, data } = useSWR<IUser[]>('/api/admin/users')
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (data) {
      setUsers(data)
    }
  }, [data])

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previusUsers = [...users]
    const updatedUsers = users.map(user => {
      if (user._id === userId) {
        return { ...user, role: newRole }
      }
      return user
    })
    setUsers(updatedUsers)
    try {
      await tesloApi.put('/admin/users', { userId, role: newRole })
    } catch (error) {
      setUsers(previusUsers)
      alert('No se pudo realizar la actualizacion del rol')
      console.log(error)
    }
  }

  if (!data && !error) return <h1>Loading...</h1>

  if (error) {
    return <h1>failed to load</h1>
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select value={row.role} label={'Rol'} sx={{ width: '300px' }} onChange={({ target }) => onRoleUpdated(row.id, target.value)} >
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='client'>Client</MenuItem>
              <MenuItem value='super-user'>Super User</MenuItem>
              <MenuItem value='SEO'>Seo</MenuItem>
          </Select>
        )
      }
    }
  ]

  const rows = users.map(user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }))

  return (
    <AdminLayout
      title={'Usuarios'}
      subTitle={'Estadisticas de los usuarios'}
      icon={<GroupOutlined />}
    >

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>

    </AdminLayout>
  )
}

export default Users
