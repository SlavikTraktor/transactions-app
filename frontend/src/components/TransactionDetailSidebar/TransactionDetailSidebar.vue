<script setup lang="ts">
import { useTransactionDetailStore } from '@/stores/transactionDetail'
import Checkbox from 'primevue/checkbox'
import SSidebar from '../ui/SSidebar.vue'
import TransactionDetailParam from './TransactionDetailParam.vue'
import { ref, watch } from 'vue'
import { BACKEND_URL } from '@/constants'
import { toast } from 'vue-sonner'

const store = useTransactionDetailStore()

const isInactive = ref(false)
const isLoading = ref(false)

watch(
  () => store.isSidebarOpen,
  (isOpen) => {
    if (isOpen) {
      isInactive.value = !!store.transaction?.is_inactive
    }
  },
)

async function toggleInactive() {
  isLoading.value = true
  isInactive.value = !isInactive.value
  store.transaction!.is_inactive = Number(isInactive.value)
  await fetch(`${BACKEND_URL}api/toggleinactive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Говорим серверу, что прислали JSON
    },
    body: JSON.stringify({ transactionId: store.transaction?.id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      toast.success('Я сделяль')
    })
    .catch(() => {
      toast.error('Я не сделяль')
    })
    .finally(() => {
      isLoading.value = false
    })
}
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
      <template v-slot:title>Неактивная</template>

      <Checkbox
        :modelValue="isInactive"
        @update:modelValue="toggleInactive()"
        :disabled="isLoading"
        inputId="inactive"
        binary
      />
      <label for="inactive"> Отключить транзакцию</label>
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
