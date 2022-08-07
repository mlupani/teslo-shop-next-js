import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
// import { jwt } from '../../utils'

export const middleware = async (req: NextRequest | any, ev: NextFetchEvent) => {
  /*
  const { token } = req.cookies

  try {
    await jwt.verifyToken(token)
    NextResponse.next()
  } catch (error) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    url.search = `p=${req.page.name}`
    return NextResponse.redirect(url)
  }
  */

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!session) {
    const url = req.nextUrl.clone()
    const requestedPage = req.page.name
    url.pathname = '/auth/login'
    url.search = `?p=${requestedPage}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
