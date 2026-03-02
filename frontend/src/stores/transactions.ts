import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getTransactions, type Transaction } from '@/api/getTransactions'
import { DATE_FORMAT } from '@/constants'
import { format } from 'date-fns'
import { useTransactionsFiltersStore } from './transactionsFilters'

export type TransactionExpanded = Transaction & {
  conversion?: {
    fromCurrency: string
    toCurrency: string
    rate: number
    resultAmount: number
  }
}

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<TransactionExpanded[]>([])
  const loadCounter = ref<number>(0)

  const filterStore = useTransactionsFiltersStore()

  const loadTransactions = async () => {
    const dateRange = filterStore.dateRange
    try {
      transactions.value = await getTransactions({
        currencies: filterStore.currencies,
        sources: filterStore.sources,
        startDate: dateRange && dateRange[0] ? format(dateRange[0], DATE_FORMAT) : undefined,
        endDate: dateRange && dateRange[1] ? format(dateRange[1], DATE_FORMAT) : undefined,
        order: filterStore.order,
      })
      loadCounter.value++
    } catch (err) {
      console.error(err)
    }
  }

  watch(
    [
      () => filterStore.currencies,
      () => filterStore.sources,
      () => filterStore.dateRange,
      () => filterStore.order,
    ],
    () => {
      loadTransactions()
    },
  )

  return { transactions, loadCounter, loadTransactions }
})
