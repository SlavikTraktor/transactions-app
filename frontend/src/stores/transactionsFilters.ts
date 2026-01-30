import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTransactionsFiltersStore = defineStore('transactionsFilters', () => {
  const dateRange = ref<[Date, Date | null]>()
  const currencies = ref<string[]>()

  const activeFiltersCount = computed(() => {
    let count = 0
    if (dateRange.value && dateRange.value[0]) {
      count++
    }
    if (currencies.value && currencies.value.length > 0) {
      count++
    }

    return count
  })

  return { dateRange, currencies, activeFiltersCount }
})
