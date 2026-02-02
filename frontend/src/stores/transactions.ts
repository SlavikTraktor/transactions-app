import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getTransactions, type Transaction } from '@/api/getTransactions'
import { DATE_FORMAT } from '@/constants'
import { format } from 'date-fns'
import { useTransactionsFiltersStore } from './transactionsFilters'

type TransactionExpanded = Transaction & {
  conversion?: {
    fromCurrency: string
    toCurrency: string
    rate: number
    resultAmount: number
  }
}

interface LoadTransactionsParams {
  currencies?: string[]
  sources?: string[]
  dateRange?: [Date, Date | null]
}

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<TransactionExpanded[]>([])

  const filterStore = useTransactionsFiltersStore()

  const loadTransactions = async ({
    currencies,
    sources,
    dateRange,
  }: LoadTransactionsParams = {}) => {
    try {
      transactions.value = await getTransactions({
        currencies: currencies,
        sources: sources,
        startDate: dateRange && dateRange[0] ? format(dateRange[0], DATE_FORMAT) : undefined,
        endDate: dateRange && dateRange[1] ? format(dateRange[1], DATE_FORMAT) : undefined,
      })
    } catch (err) {
      console.error(err)
    }
  }

  watch(
    [() => filterStore.currencies, () => filterStore.sources, () => filterStore.dateRange],
    ([currencies, sources, dateRange]) => {
      loadTransactions({
        currencies,
        sources,
        dateRange,
      })
    },
  )

  return { transactions, loadTransactions }
})
