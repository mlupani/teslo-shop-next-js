import { IProductCart, ShippingAddress } from '../../interfaces'
import { CartState } from './'

type CartActionType =
| { type: 'Cart - get cart from cookie', payload: IProductCart[] | []}
| { type: 'Cart - Update products in cart', payload: IProductCart[]}
| { type: 'Cart - Remove product from cart', payload: IProductCart[]}
| { type: 'Cart - Update order summary', payload: {
    cantItems: number;
    subTotal: number;
    taxRate: number;
    total: number;
}}
| { type: 'Cart - Load Address from cookie', payload: ShippingAddress | undefined}
| { type: 'Cart - Order Complete', payload: undefined}

export const cartReducer = (state: CartState, { type, payload }: CartActionType):CartState => {
  switch (type) {
    case 'Cart - Update products in cart':
      return {
        ...state,
        cart: payload
      }
    case 'Cart - get cart from cookie':
      return {
        ...state,
        isLoaded: true,
        cart: payload,
        initialized: true
      }
    case 'Cart - Remove product from cart':
      return {
        ...state,
        cart: payload
      }
    case 'Cart - Update order summary':
      return {
        ...state,
        ...payload
      }
    case 'Cart - Load Address from cookie':
      return {
        ...state,
        shippingAddress: payload
      }
    case 'Cart - Order Complete':
      return {
        ...state,
        cart: [],
        total: 0,
        subTotal: 0,
        taxRate: 0,
        cantItems: 0
      }
    default:
      return state
  }
}
