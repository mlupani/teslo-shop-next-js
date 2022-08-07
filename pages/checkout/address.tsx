import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { CartContext } from '../../context'
import { Box, Button, FormControl, Grid, MenuItem, TextField } from '@mui/material'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { countries } from '../../utils/countries'
import { useForm, SubmitHandler } from 'react-hook-form'
import Cookies from 'js-cookie'

type FormData = {
  firstName: string,
  lastName: string,
  address: string,
  address2?: string,
  zip: string,
  city: string,
  country: string,
  phone: string,
};

const addressPage = () => {
  const router = useRouter()
  const { LoadAddressFromCookie } = useContext(CartContext)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      address2: '',
      zip: '',
      city: '',
      country: countries[0].code,
      phone: ''
    }
  })

  const getAddressFromCookie = () => {
    if (Cookies.get('addressForm')) {
      const { firstName, lastName, address, address2, zip, city, country, phone } = JSON.parse(Cookies.get('addressForm')!)
      setValue('firstName', firstName)
      setValue('lastName', lastName)
      setValue('address', address)
      setValue('address2', address2)
      setValue('zip', zip)
      setValue('city', city)
      setValue('country', country)
      setValue('phone', phone)
    }
  }

  const revisarPedido: SubmitHandler<FormData> = (data: FormData) => {
    Cookies.set('addressForm', JSON.stringify(data))
    router.push('/checkout/summary')
    LoadAddressFromCookie(data)
  }

  useEffect(() => {
    getAddressFromCookie()
  }, [])

  return (
    <ShopLayout title={'Adsress'} pageDescription={'Descripcion'}>
        <h1>Address</h1>
        <form onSubmit={handleSubmit(revisarPedido)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label={'Nombre'} variant='filled' fullWidth
              {...register('firstName', {
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                }
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={'Apellido'} variant='filled' fullWidth
              {...register('lastName', {
                required: 'El apellido es requerido',
                minLength: {
                  value: 2,
                  message: 'El apellido debe tener al menos 2 caracteres'
                }
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={'Direccion'} variant='filled' fullWidth
              {...register('address', {
                required: 'La direccion es requerida',
                minLength: {
                  value: 2,
                  message: 'La direccion debe tener al menos 2 caracteres'
                }
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={'Direccion2 (opcional)'} variant='filled' fullWidth
              {...register('address2')}
             />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={'Codigo postal'} variant='filled' fullWidth
               {...register('zip', {
                 required: 'El codigo postal es requerido',
                 minLength: {
                   value: 2,
                   message: 'El codigo postal debe tener al menos 2 caracteres'
                 }
               })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
             />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={'Ciudad'} variant='filled' fullWidth
              {...register('city', {
                required: 'La ciudad es requerida',
                minLength: {
                  value: 2,
                  message: 'La ciudad debe tener al menos 2 caracteres'
                }
              })}
             error={!!errors.city}
             helperText={errors.city?.message}
             />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth >
              <TextField select variant={'filled'} defaultValue={countries[0].code} label={'pais'} fullWidth
                {...register('country', {
                  required: 'El pais es requerido',
                  minLength: {
                    value: 3,
                    message: 'El pais debe tener al menos 3 caracteres'
                  }
                })}
               error={!!errors.country}
               helperText={errors.country?.message}
              >
                {
                  countries.map(country => (
                    <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>
                  ))
                }
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={'Telefono'} variant='filled' fullWidth
              {...register('phone', {
                required: 'El telefono es requerido',
                minLength: {
                  value: 6,
                  message: 'el telefono debe tener al menos 6 caracteres'
                }
              })}
             error={!!errors.city}
             helperText={errors.city?.message}
             />
          </Grid>
        </Grid>

        <Box display={'flex'} justifyContent={'center'} sx={{ my: 5 }}>
          <Button type="submit" className='circular-btn' size='small' color={'secondary'}>Revisar pedido</Button>
        </Box>
        </form>
    </ShopLayout>
  )
}

export default addressPage
