import { IUser } from './'
import { Isize } from './products'

export interface IOrderItem {
    _id: string
    title: string
    size: Isize
    quantity: number
    slug: string
    image: string
    price: number
}

export interface ShippingAddress {
    firstName: string,
    lastName: string,
    address: string,
    address2?: string | undefined,
    zip: string,
    city: string,
    country: string,
    phone: string
  }

export interface IOrder {
    _id?: string
    user?: IUser | string
    orderItems: IOrderItem[]
    shippingAddress: ShippingAddress
    paymentMethod?: string
    cantItems: number
    subTotal: number
    taxRate: number
    total: number
    isPaid: boolean
    paidAt?: string
    transactionId?: string
    createdAt?: string
}
