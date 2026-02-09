<script setup lang="ts">
import { useTransactionDetailStore } from '@/stores/transactionDetail'
import SSidebar from '../ui/SSidebar.vue'
import TransactionDetailParam from './TransactionDetailParam.vue';

const store = useTransactionDetailStore()
</script>

<template>
  <SSidebar :isOpen="store.isSidebarOpen" @close="() => store.closeSidebar()">
    <template v-slot:title>Транзакция {{ store.transaction?.uuid }}</template>

    <TransactionDetailParam>
      <template v-slot:title>Сумма</template>
      {{ store.transaction?.amount }}
    </TransactionDetailParam>

    <TransactionDetailParam>
      <template v-slot:title>Валюта</template>
      {{ store.transaction?.currency }}
    </TransactionDetailParam>

    <TransactionDetailParam>
      <template v-slot:title>Дата</template>
      {{ store.transaction?.timestamp }}
    </TransactionDetailParam>

    <TransactionDetailParam>
      <template v-slot:title>Отправитель</template>
      {{ store.transaction?.sender || '-' }}
    </TransactionDetailParam>

    <TransactionDetailParam>
      <template v-slot:title>Описание</template>
      {{ store.transaction?.description || '-' }}
    </TransactionDetailParam>

    <TransactionDetailParam>
      <template v-slot:title>Источник</template>
      {{ store.transaction?.source_type }}
    </TransactionDetailParam>
  </SSidebar>
</template>

<style scoped></style>
