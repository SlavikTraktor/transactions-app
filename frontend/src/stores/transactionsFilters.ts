import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Order } from '@/types/order'

export const useTransactionsFiltersStore = defineStore('transactionsFilters', () => {
  const dateRange = ref<[Date, Date | null]>()
  const currencies = ref<string[]>()
  const sources = ref<string[]>()
  const isMonthlyView = ref(true)
  const order = ref<Order>({ orderBy: 'timestamp', order: 'desc' })

  const setFilters = (filters: {
    dateRange?: [Date, Date | null]
    currencies?: string[]
    sources?: string[]
  }) => {
    dateRange.value = filters.dateRange
    currencies.value = filters.currencies
    sources.value = filters.sources
  }

  const activeFiltersCount = computed(() => {
    let count = 0
    if (dateRange.value && dateRange.value[0]) {
      count++
    }
    if (currencies.value && currencies.value.length > 0) {
      count++
    }
    if (sources.value && sources.value.length > 0) {
      count++
    }

    return count
  })

  return { dateRange, currencies, sources, isMonthlyView, activeFiltersCount, order, setFilters }
})
