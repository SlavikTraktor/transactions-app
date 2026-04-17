import { BACKEND_URL } from '@/constants'
import axios from 'axios'

export interface StartUpdateResponse {
  message: string
}

export const startUpdate = async (): Promise<StartUpdateResponse> => {
  return axios
    .post(`${BACKEND_URL}api/start-update`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching transactions:', error)
      throw error
    })
}
