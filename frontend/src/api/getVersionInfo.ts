import { BACKEND_URL } from '@/constants'
import axios from 'axios'

export interface VersionInfo {
  currentVersion: string
  latestVersion: string
}

export const getVersionInfo = async (): Promise<VersionInfo> => {
  return axios
    .get(`${BACKEND_URL}api/version-info`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching transactions:', error)
      throw error
    })
}
