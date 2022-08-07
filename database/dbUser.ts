import { User } from '../models'
import { db } from './'
import bcrypt from 'bcryptjs'

export const getUserByEmailAndPassword = async (email: string, password: string) => {
  await db.connect()
  const user = await User.findOne({ email })
  if (!user) {
    return null
  }
  await db.disconnect()
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return null
  }
  return {
    email: user.email,
    name: user.name,
    role: user.role,
    _id: user._id
  }
}

export const oAuthLogin = async (email: string = '', userName: string = '') => {
  await db.connect()
  const user = await User.findOne({ email })
  if (user) {
    await db.disconnect()
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      _id: user._id
    }
  }
  if (!user) {
    const newUser = new User({
      email,
      name: userName,
      password: '@',
      role: 'client'
    })
    await newUser.save()
    await db.disconnect()
    return {
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      _id: newUser._id
    }
  }
}
