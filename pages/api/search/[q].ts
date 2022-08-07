import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data = { message: string } | IProduct[] | null

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProductsBySearch(req, res)
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function getProductsBySearch (req: NextApiRequest, res: NextApiResponse<Data>) {
  let { q = '' } = req.query
  q = q.toString().toLowerCase()

  if (!q) return res.status(400).json({ message: 'No se ha ingresado una busqueda' })

  try {
    await db.connect()
    const products = await Product.find({ $text: { $search: q } }).lean()
    await db.disconnect()
    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al realizar la consulta' })
  }
}
