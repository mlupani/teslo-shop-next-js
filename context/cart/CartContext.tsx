import { createContext } from 'react'
import { IProductCart, ShippingAddress } from '../../interfaces/'

interface ContextProps {
    isLoaded: boolean;
    cart: IProductCart[];
    cantItems: number;
    subTotal: number;
    taxRate: number;
    total: number;
    shippingAddress: ShippingAddress | undefined
    addProduct: (product: IProductCart) => void;
    removeProduct: (product: IProductCart) => void;
    LoadAddressFromCookie: (address?: ShippingAddress | undefined) => void;
    createOrder: () => Promise<{hasError: boolean, message: string}>;
}

export const CartContext = createContext({} as ContextProps)
