import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IPaypal } from '../../../interfaces'
import { Order } from '../../../models'

type Data = {
    message: string
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      payOrder(req, res)
      break
    default:
      res.status(405).json({ message: 'Method not allowed' })
  }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET

  const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64')
  const body = new URLSearchParams('grant_type=client_credentials')

  try {
    const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
      headers: {
        Authorization: `Basic ${base64Token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return data.access_token
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data)
    } else {
      console.log(error)
    }

    return null
  }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const paypalBearerToken = await getPaypalBearerToken()

  if (!paypalBearerToken) {
    return res.status(500).json({ message: 'Could not get paypal bearer token' })
  }

  const { transactionId = '', orderId = '' } = req.body

  const { data } = await axios.get<IPaypal.PaypalResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}` || '', {
    headers: {
      Authorization: `Bearer ${paypalBearerToken}`
    }
  })

  if (data.status !== 'COMPLETED') {
    return res.status(500).json({ message: 'Payment not completed' })
  }

  await db.connect()
  const DBOrder = await Order.findById(orderId)

  if (!DBOrder) {
    db.disconnect()
    return res.status(500).json({ message: 'Order not found' })
  }

  if (DBOrder.total !== Number(data.purchase_units[0].amount.value)) {
    db.disconnect()
    return res.status(500).json({ message: 'Order total does not match' })
  }

  DBOrder.isPaid = true
  DBOrder.transactionId = transactionId
  await DBOrder.save()
  db.disconnect()

  return res.status(200).json({ message: 'Order pagada' })
}
