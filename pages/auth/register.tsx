import { useContext, useState } from 'react'
import { GetServerSideProps } from 'next'
import NextLink from 'next/link'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layouts'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ErrorOutline } from '@mui/icons-material'
import { validations } from '../../utils'
import { AuthContext } from '../../context/auth'
import { useRouter } from 'next/router'
import { getSession, signIn } from 'next-auth/react'

type FormData = {
  name: string
  email: string,
  password: string,
};

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [showError, setShowError] = useState(false)
  const { onRegister } = useContext(AuthContext)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const onUserRegister: SubmitHandler<FormData> = async ({ email, password, name }) => {
    setShowError(false)
    const { hasError, error } = await onRegister({ name, email, password })
    if (hasError) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      if (error) { setErrorMessage(error) }
      return
    }
    /*
    const destination = router.query.p?.toString() || '/'
    router.replace(destination)
    */
    await signIn('credentials', { email, password })
  }
  return (
    <AuthLayout title={'Registrarse'}>
        <form onSubmit={handleSubmit(onUserRegister)} noValidate>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Registrarse</Typography>
                        <Chip
                          label={errorMessage}
                          color='error'
                          icon={<ErrorOutline/>}
                          className='fadeIn'
                          sx={{ display: showError ? 'flex' : 'none' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Nombre' variant='outlined' fullWidth
                            {...register('name', {
                              required: 'El nombre es requerido',
                              minLength: {
                                value: 6,
                                message: 'El nombre debe tener al menos 6 caracteres'
                              }
                            })}
                              error={!!errors.email}
                              helperText={errors.email?.message}
                         />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Correo' variant='outlined' fullWidth
                            {...register('email', {
                              required: 'El correo es requerido',
                              validate: validations.isEmail
                            })}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                         />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Contraseña' type='password' variant='outlined' fullWidth
                            {...register('password', {
                              required: 'La contraseña es requerida',
                              minLength: {
                                value: 6,
                                message: 'La contraseña debe tener al menos 6 caracteres'
                              }
                            })}
                              error={!!errors.password}
                              helperText={errors.password?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" color='secondary' fullWidth className='circular-btn' >Registrarse</Button>
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={`/auth/login?p=${router.query.p?.toString() || '/auth/login'}`} passHref>
                            <Link>
                                <Typography variant='body2' color='textSecondary'>¿Ya tienes una cuenta?</Typography>
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

export default RegisterPage

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req })
  const { p = '/' } = query

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: {

    }
  }
}
