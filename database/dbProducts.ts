import { db } from './'
import { Product } from '../models'
import { IProduct } from '../interfaces'

export const getProductBySlug = async (slug:string):Promise<IProduct | null> => {
  await db.connect()
  const product = await Product.findOne({ slug }).lean()
  await db.disconnect()

  if (!product) return null

  return JSON.parse(JSON.stringify(product))
}

export const getAllProductSlugs = async ():Promise<string[]> => {
  await db.connect()
  const products = await Product.find().lean()
  await db.disconnect()

  return products.map(product => product.slug)
}

export const getProductsBySearch = async (search:string):Promise<IProduct[]> => {
  await db.connect()
  const products = await Product.find({ $text: { $search: search } }).lean()
  await db.disconnect()

  return JSON.parse(JSON.stringify(products))
}

export const getAllProducts = async ():Promise<IProduct[]> => {
  await db.connect()
  const products = await Product.find().lean()
  await db.disconnect()

  return JSON.parse(JSON.stringify(products))
}
