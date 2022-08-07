import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import { jwt } from '../../../utils'

type Data = { message: string } | { token: string, user: { email:string, name: string, role: string} }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      checkJWT(req, res)
      break
    default:
      res.status(400).json({ message: 'bad Request' })
  }
}
async function checkJWT (req: NextApiRequest, res: NextApiResponse<Data>) {
  const { token = '' } = req.cookies

  if (!token) {
    res.status(401).json({ message: 'no token' })
    return
  }

  let userId = ''

  try {
    userId = await jwt.verifyToken(token)
  } catch (error) {
    res.status(401).json({ message: 'invalid token' })
    return
  }

  await db.connect()
  const user = await User.findById(userId).lean()
  await db.disconnect()

  if (!user) {
    res.status(400).json({ message: 'No user' })
  }

  const { email, name, role, _id } = user!

  res.status(200).json({
    token: jwt.signToken(_id, email),
    user: {
      email, name, role
    }
  })
}
