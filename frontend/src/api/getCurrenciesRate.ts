import { BACKEND_URL } from '@/constants'
import type { CurrenciesRate } from '@/types/currenciesRates'
import axios from 'axios'

export const getCurrenciesRate = async (
  date: string,
  ccy?: string[],
): Promise<[CurrenciesRate]> => {
  return axios
    .get(`${BACKEND_URL}api/currencyrate`, {
      params: {
        date: date,
        ccy: ccy ? ccy.join(',') : 'USD',
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching currency rates:', error)
      throw error
    })
}
