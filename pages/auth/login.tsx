import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { getSession, signIn, getProviders } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layouts'
import { useForm, SubmitHandler } from 'react-hook-form'
import { validations } from '../../utils'
import { ErrorOutline } from '@mui/icons-material'

type FormData = {
    email: string,
    password: string,
  };

const loginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [showError, setShowError] = useState(false)
  const router = useRouter()

  const [providers, setProviders] = useState<any>({})

  useEffect(() => {
    getProviders().then(res => setProviders(res))
  }, [])

  const login: SubmitHandler<FormData> = async ({ email, password }) => {
    setShowError(false)
    /*
    const isValid = await onLogin({ email, password })
    if (!isValid) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }
    const destination = router.query.p?.toString() || '/'
    router.replace(destination)
    */
    await signIn('credentials', { email, password })
  }
  return (
    <AuthLayout title={'Ingresar'}>
         <form onSubmit={handleSubmit(login)} noValidate>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Ingresar</Typography>
                        <Chip
                          label='No se reconoce el email o la contraseña'
                          color='error'
                          icon={<ErrorOutline/>}
                          className='fadeIn'
                          sx={{ display: showError ? 'flex' : 'none' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type="email" label='Correo' variant='outlined' fullWidth
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
                        <Button type="submit" color='secondary' fullWidth className='circular-btn' >Ingresar</Button>
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={`/auth/register?p=${router.query.p?.toString() || '/auth/register'}`} passHref>
                            <Link>
                                <Typography variant='body2' color='textSecondary'>¿No tienes una cuenta?</Typography>
                            </Link>
                        </NextLink>
                    </Grid>

                    <Grid item xs={12} display='flex' flexDirection={'column'} justifyContent='end'>
                        <Divider sx={{ width: '100%', mb: 2 }} />

                        {
                            Object.keys(providers).map(key => {
                              const provider = providers[key]
                              if (provider.id === 'credentials') return null
                              return (
                                    <Button key={key} variant='contained' color='primary' fullWidth
                                    onClick={() => signIn(key)}>
                                        {provider.name}
                                    </Button>
                              )
                            })
                        }
                    </Grid>

                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

export default loginPage

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
