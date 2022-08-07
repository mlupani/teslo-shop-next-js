import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcyptjs from 'bcryptjs'
import { jwt, validations } from '../../../utils'

type Data = { message: string } | { token: string, user: { email:string, name: string, role: string} }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      registerUser(req, res)
      break
    default:
      res.status(400).json({ message: 'bad Request' })
  }
}
async function registerUser (req: NextApiRequest, res: NextApiResponse<Data>) {
  let { name = '', email = '', password = '' } = req.body
  if (!email || !password || !name) {
    res.status(400).json({ message: 'email, name and password are required' })
  }

  if (name < 2) {
    res.status(400).json({ message: 'name must be at least 2 characters' })
  }

  if (password < 6) {
    res.status(400).json({ message: 'password must be at least 6 characters' })
  }

  email = email.toLowerCase()

  if (!validations.isValidEmail(email)) {
    res.status(400).json({ message: 'email is not valid' })
  }

  await db.connect()
  const user = await User.findOne({ email })

  if (user) {
    await db.disconnect()
    res.status(400).json({ message: 'user already exists' })
  }

  const newUser = new User({ name, email, password: bcyptjs.hashSync(password), role: 'client' })

  try {
    await newUser.save({ validateBeforeSave: true })
  } catch (error) {
    console.log(error)
    await db.disconnect()
    res.status(500).json({ message: 'Revisar logs de error' })
  }

  await db.disconnect()

  res.status(200).json({
    token: jwt.signToken(newUser?._id!, email),
    user: {
      email, name: name!, role: 'client'
    }
  })
}
