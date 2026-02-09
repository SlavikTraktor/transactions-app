import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TransactionExpanded } from './transactions'

export const useTransactionDetailStore = defineStore('transactionDetail', () => {
  const transaction = ref<TransactionExpanded>()

  const showDetail = (t: TransactionExpanded) => {
    transaction.value = t
  }

  const closeSidebar = () => {
    transaction.value = undefined
  }

  const isSidebarOpen = computed(() => transaction.value !== undefined)

  return { transaction, isSidebarOpen, showDetail, closeSidebar }
})
