import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'
import { SHOP_CONTANTS } from '../../../database/contants'

type Data = { message: string } | IProduct[]

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res)
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function getProducts (req: NextApiRequest, res: NextApiResponse<Data>) {
  const { gender } = req.query
  let condition = {}
  if (gender && SHOP_CONTANTS.validGenders.includes(`${gender}`)) condition = { gender }

  try {
    await db.connect()
    const products = await Product.find(condition).select('images inStock price slug title -_id').lean()
    await db.disconnect()
    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al realizar la consulta' })
  }
}
