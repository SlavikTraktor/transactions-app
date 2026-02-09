<script setup lang="ts">
import { useTransactionDetailStore } from '@/stores/transactionDetail'
import type { TransactionExpanded } from '@/stores/transactions'
import { computed } from 'vue'
const {
  useConversion = false,
  transactions,
  currency,
} = defineProps<{
  useConversion?: boolean
  currency: string
  transactions: TransactionExpanded[]
}>()

const transactionDetailStore = useTransactionDetailStore()

const summaryIncome = computed(() => {
  return transactions.reduce(
    (acc, tx) => {
      const amount = useConversion ? tx.conversion?.resultAmount || 0 : tx.amount
      return {
        counting: acc.counting === '' ? `${amount}` : `${acc.counting} + ${amount}`,
        result: acc.result + amount,
      }
    },
    {
      counting: '',
      result: 0,
    },
  )
})
</script>

<template>
  <div>
    <div class="text-lg font-bold">
      <slot name="title">Название валюты или заголовок</slot>
    </div>
    <div>
      <span class="text-gray-400">
        <span
          class="hover:text-lime-600 cursor-pointer"
          v-for="(t, index) in transactions"
          :key="t.uuid"
          @click="() => transactionDetailStore.showDetail(t)"
          >{{ index ? ` + ${t.amount}` : t.amount }}</span
        >
      </span>
      =
      <span class="bold">{{ summaryIncome.result.toFixed(2) }} {{ currency }}</span>
    </div>
  </div>
</template>

<style scoped></style>
