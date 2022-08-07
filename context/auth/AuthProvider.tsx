import { FC, useReducer, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import { tesloApi } from '../../api'
import { IUser } from '../../interfaces'
import { AuthContext, authReducer } from './'
import Cookies from 'js-cookie'
import axios from 'axios'

export interface AuthState {
   isLoggedIn: boolean;
   user?: IUser | undefined
}

export const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined
}

interface Props {
    children: ReactNode
}

type FormData = {
    email: string,
    password: string,
  };

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
  const router = useRouter()
  const { data, status } = useSession()

  useEffect(() => {
    // validateUser()
    if (status === 'authenticated') {
      dispatch({ type: 'Auth - login', payload: data?.user as IUser })
    }
  }, [status, data])

  /*
  const validateUser = async () => {
    if (!Cookies.get('token')) {
      return
    }
    try {
      const { data } = await tesloApi.get('/user/validate-token')
      const { token, user } = data
      Cookies.set('token', token)
      dispatch({ type: 'Auth - login', payload: user })
    } catch (error) {
      Cookies.remove('token')
    }
  }
  */

  const onLogin = async ({ email, password }: FormData) => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password })
      const { token, user } = data
      Cookies.set('token', token)
      dispatch({ type: 'Auth - login', payload: user })
      return true
    } catch (error) {
      return false
    }
  }

  const onLogout = () => {
    Cookies.remove('cart')
    Cookies.remove('addressForm')
    signOut()
  }

  const onRegister = async ({ name, email, password }: { name: string, email: string, password: string}): Promise <{ hasError: boolean, error?: string}> => {
    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password })
      const { token, user } = data
      Cookies.set('token', token)
      dispatch({ type: 'Auth - login', payload: user })
      return {
        hasError: false
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          error: error?.response?.data?.message
        }
      }

      return {
        hasError: true,
        error: 'No se pudo crear el usuario, intente nuevamente'
      }
    }
  }

  return (
        <AuthContext.Provider value={{
          ...state,
          onLogin,
          onRegister,
          onLogout
        }}>
             {children}
        </AuthContext.Provider>
  )
}
