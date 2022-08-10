import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'
import { db } from '../../../database'
import { IUser } from '../../../interfaces'
import { User } from '../../../models'

type Data =
| { message: string }
| IUser[]
| IUser

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      getUsers(req, res)
      break
    case 'PUT':
      updateUser(req, res)
      break
    default:
      res.status(404).json({ message: 'Method not found' })
      break
  }
}
const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect()
  const users = await User.find().select('-password').lean()
  await db.disconnect()

  return res.status(200).json(users)
}

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = '', role = '' } = req.body

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user id' })
  }

  const validRoles = ['admin', 'client', 'super-user', 'SEO']
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' })
  }

  await db.connect()
  const user = await User.findByIdAndUpdate(userId, { role }, { new: false }).lean()
  await db.disconnect()

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.status(200).json(user)
}
