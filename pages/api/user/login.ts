import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcyptjs from 'bcryptjs'
import { jwt } from '../../../utils'

type Data = { message: string } | { token: string, user: { email:string, name: string, role: string} }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      loginUser(req, res)
      break
    default:
      res.status(400).json({ message: 'bad Request' })
  }
}
async function loginUser (req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ message: 'email and password are required' })
  }
  await db.connect()
  const user = await User.findOne({ email })
  await db.disconnect()
  if (!user) {
    res.status(400).json({ message: 'user not found' })
  }

  if (!bcyptjs.compareSync(password, user?.password!)) {
    res.status(400).json({ message: 'password is incorrect' })
  }

  res.status(200).json({
    token: jwt.signToken(user?._id!, user?.email!),
    user: {
      email, name: user?.name!, role: user?.role!
    }
  })
}
