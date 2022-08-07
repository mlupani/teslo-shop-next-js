import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database/'

import Product from '../../models/products'
import User from '../../models/user'

interface data {
    message: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<data>) {
  try {
    await db.connect()
    await Product.deleteMany()
    await User.deleteMany()
    await Product.insertMany(seedDatabase.initialData.products)
    await User.insertMany(seedDatabase.initialData.user)
    await db.disconnect()
  } catch (error) {
    res.status(500).json({ message: 'Hubo un error al realizar el seed' })
    await db.disconnect()
  }

  res.status(200).json({ message: 'Realizado con exito' })
}
