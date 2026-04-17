import { BACKEND_URL } from '@/constants'
import axios from 'axios'

export interface UpdateStatus {
  status: 'idle' | 'downloading' | 'applying' | 'error' | 'done'
  error: string | null
  downloadedMB?: number
  totalSizeMB?: number
  percent?: number
}

export const getUpdateStatus = async (): Promise<UpdateStatus> => {
  return axios
    .get(`${BACKEND_URL}api/update-status`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching transactions:', error)
      throw error
    })
}
