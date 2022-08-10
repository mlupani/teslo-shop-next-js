import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Order, Product, User } from '../../../models'

type Data = {
    numberOfOrders: number
    paidOrders: number
    notPaidOrders: number
    numberOfClients?: number
    numberOfProducts?: number
    productsWithNoInventory?: number
    lowInventory?: number
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  db.connect()

  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    User.count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count()
  ])

  db.disconnect()

  res.status(200).json({ numberOfOrders, paidOrders, notPaidOrders: numberOfOrders - paidOrders, numberOfClients, numberOfProducts, productsWithNoInventory, lowInventory })
}
