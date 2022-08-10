import { FC, useReducer, ReactNode, useEffect } from 'react'
import { IOrder, IProductCart, ShippingAddress } from '../../interfaces'
import { CartContext, cartReducer } from './'
import Cookie from 'js-cookie'
import tesloApi from '../../api/tesloApi'
import axios from 'axios'

export interface CartState {
   isLoaded: boolean;
   cart: IProductCart[];
   initialized: boolean;
   cantItems: number;
   subTotal: number;
   taxRate: number;
   total: number;
   shippingAddress: ShippingAddress | undefined
}

export const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  initialized: false,
  cantItems: 0,
  subTotal: 0,
  taxRate: 0,
  total: 0,
  shippingAddress: undefined
}

interface Props {
  children: ReactNode
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

  useEffect(() => {
    const cart:IProductCart[] = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
    dispatch({
      type: 'Cart - get cart from cookie',
      payload: cart
    })
  }, [])

  useEffect(() => {
    if (state.initialized) { Cookie.set('cart', JSON.stringify(state.cart)) }
  }, [state.cart])

  useEffect(() => {
    const cantItems = state.cart.reduce((acc, item) => acc + item.quantity, 0)
    const subTotal = state.cart.reduce((acc, item) => acc + item.quantity * item.price, 0)
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
    const orderSummary = {
      cantItems,
      subTotal,
      taxRate: subTotal * taxRate,
      total: subTotal * (1 + taxRate)
    }
    dispatch({
      type: 'Cart - Update order summary',
      payload: orderSummary
    })
  }, [state.cart])

  useEffect(() => {
    LoadAddressFromCookie()
  }, [])

  const addProduct = (product: IProductCart) => {
    let newCart: IProductCart[] = []
    let finded = false
    newCart = state.cart.map(prodct => {
      if (prodct._id === product._id && prodct.size === product.size) {
        finded = true
        return { ...prodct, quantity: prodct.quantity + product.quantity }
      }
      return prodct
    })

    if (!finded) newCart.push(product)

    dispatch({
      type: 'Cart - Update products in cart',
      payload: newCart
    })
  }

  const removeProduct = (product: IProductCart) => {
    const newCart: IProductCart[] = state.cart.filter(prodct => !(prodct._id === product._id && prodct.size === product.size))
    dispatch({
      type: 'Cart - Remove product from cart',
      payload: newCart
    })
  }

  const LoadAddressFromCookie = (address?: ShippingAddress | undefined) => {
    let shippingAddress
    if (address) { shippingAddress = address } else { shippingAddress = Cookie.get('addressForm') ? JSON.parse(Cookie.get('addressForm')!) : undefined }

    dispatch({
      type: 'Cart - Load Address from cookie',
      payload: shippingAddress
    })
  }

  const createOrder = async (): Promise<{ hasError: boolean, message: string }> => {
    if (!state.shippingAddress) {
      throw new Error('You must select a shipping address')
    }

    const body: IOrder = {
      orderItems: state.cart.map(prod => ({
        ...prod,
        size: prod.size!
      })),
      shippingAddress: state.shippingAddress,
      cantItems: state.cantItems,
      subTotal: state.subTotal,
      taxRate: state.taxRate,
      total: state.total,
      isPaid: false
    }

    try {
      const { data } = await tesloApi.post('/orders', body)

      dispatch({ type: 'Cart - Order Complete', payload: undefined })

      return {
        hasError: false,
        message: data.newOrder._id!
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: (error.response?.data as any).message
        }
      }
      return {
        hasError: true,
        message: 'Error no controlado, contacte con el administrador'
      }
    }
  }

  return (
        <CartContext.Provider value={{
          ...state,
          addProduct,
          removeProduct,
          LoadAddressFromCookie,
          createOrder
        }}>
             {children}
        </CartContext.Provider>
  )
}
