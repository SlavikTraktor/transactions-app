import { BACKEND_URL } from '@/constants'
import axios from 'axios'

export interface Transaction {
  uuid: string
  timestamp: string
  amount: number
  description: string
  sender: string
  currency: string
  source_type: string
}

export const getTransactions = async (): Promise<Transaction[]> => {
  return axios
    .get(`${BACKEND_URL}api/transactions`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching transactions:', error)
      throw error
    })
}
