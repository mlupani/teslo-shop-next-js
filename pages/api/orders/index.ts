import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { db } from '../../../database'
import { IOrder } from '../../../interfaces'
import { Product, Order } from '../../../models'

type Data = { message: string } | { newOrder: IOrder }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      crearOrden(req, res)
      break
    default:
      res.status(405).json({ message: 'Method not allowed' })
      break
  }
}

const crearOrden = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const productsIds = orderItems.map(item => item._id)

  await db.connect()
  const dbProducts = await Product.find({ _id: { $in: productsIds } })

  try {
    const subTotal = orderItems.reduce((acc, item) => {
      const currentPrice = dbProducts.find(product => product.id === item._id)!.price
      if (!currentPrice) {
        throw new Error('No se encontro el precio del producto')
      }
      return acc + (item.quantity * item.price)
    }, 0)

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
    const backendTotal = subTotal * (taxRate + 1)

    if (total !== backendTotal) {
      throw new Error('El total no coincide')
    }

    const userId = session.user._id
    const newOrder = new Order({ ...req.body, user: userId, isPaid: false })
    newOrder.total = Math.round(newOrder.total * 100) / 100
    await newOrder.save()
    await db.disconnect()
    return res.status(201).json({ newOrder })
  } catch (error: any) {
    await db.disconnect()
    console.log(error)
    return res.status(400).json({ message: error.message || 'Revise los logs del servidor' })
  }
}
