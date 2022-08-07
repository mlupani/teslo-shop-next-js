import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data = { message: string } | IProduct | null

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProductsBySlug(req, res)
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function getProductsBySlug (req: NextApiRequest, res: NextApiResponse<Data>) {
  const { slug } = req.query
  let condition = {}
  if (slug) condition = { slug }

  try {
    await db.connect()
    const product = await Product.findOne(condition).lean()
    await db.disconnect()
    return res.status(200).json(product)
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al realizar la consulta' })
  }
}
