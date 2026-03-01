import { BACKEND_URL } from '@/constants'
import type { Order } from '@/types/order'
import axios from 'axios'

export interface Transaction {
  id: number
  uuid: string
  timestamp: string
  amount: number
  description: string
  sender: string
  currency: string
  source_type: string
  is_inactive: number
}

interface GetTransactonsParams {
  startDate?: string
  endDate?: string
  currencies?: string[]
  sources?: string[]
  order?: Order
}

export const getTransactions = async (params: GetTransactonsParams): Promise<Transaction[]> => {
  const queryParams = new URLSearchParams()
  if (params.startDate) queryParams.append('startDate', params.startDate)
  if (params.endDate) queryParams.append('endDate', params.endDate)
  if (params.currencies && params.currencies.length > 0) {
    queryParams.append('currencies', params.currencies.join(','))
  }
  if (params.sources && params.sources.length > 0) {
    queryParams.append('sources', params.sources.join(','))
  }

  if (params.order) {
    queryParams.append('orderBy', params.order.orderBy)
    queryParams.append('order', params.order.order)
  }

  return axios
    .get(`${BACKEND_URL}api/transactions?${queryParams.toString()}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching transactions:', error)
      throw error
    })
}
