<script setup lang="ts">
import { useTransactionsStore } from '@/stores/transactions'
import OutlineButton from './ui/OutlineButton.vue'

const transactionsStore = useTransactionsStore()
</script>

<template>
  <OutlineButton @click="transactionsStore.loadTransactions()"> Обновить </OutlineButton>
</template>

<style scoped></style>
