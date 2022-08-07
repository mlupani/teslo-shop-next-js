import type { AppProps } from 'next/app'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { SWRConfig } from 'swr'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { lightTheme } from '../themes'
import { CartProvider, UIProvider } from '../context'
import '../styles/globals.css'
import { AuthProvider } from '../context/auth/AuthProvider'
import { SessionProvider } from 'next-auth/react'

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{
        'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT || ''
      }} >
      <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <AuthProvider>
      <UIProvider>
        <CartProvider>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline/>
            <Component {...pageProps} />
          </ThemeProvider>
        </CartProvider>
      </UIProvider>
      </AuthProvider>
    </SWRConfig>
    </PayPalScriptProvider>
  </SessionProvider>
  )
}

export default MyApp
