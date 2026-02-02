<script setup lang="ts">
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
      <span class="text-gray-400">{{ summaryIncome.counting }}</span> =
      <span class="bold">{{ summaryIncome.result.toFixed(2) }} {{ currency }}</span>
    </div>
  </div>
</template>

<style scoped></style>
