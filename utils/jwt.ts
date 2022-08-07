import jsw from 'jsonwebtoken'

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  return jsw.sign({ _id, email }, process.env.JWT_SECRET!, { expiresIn: '1d' })
}

export const verifyToken = async (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  return new Promise((resolve, reject) => {
    try {
      jsw.verify(token, process.env.JWT_SECRET!, (error, pauload) => {
        if (error) {
          reject(error)
        } else {
          const { _id } = pauload as { _id: string}
          resolve(_id)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}
