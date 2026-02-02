<script setup lang="ts">
import { useTransactionsStore } from '@/stores/transactions'
import OutlineButton from '../ui/OutlineButton.vue'
import SModal from '../ui/SModal.vue'
import { computed } from 'vue'
import _ from 'lodash'
import SummaryCounting from './SummaryCounting.vue'

defineProps({
  isOpen: Boolean,
})

defineEmits(['close'])

const store = useTransactionsStore()

const groppedByCurrency = computed(() => {
  return _.groupBy(store.transactions, 'currency')
})
</script>

<template>
  <SModal :isOpen="isOpen" @close="$emit('close')">
    <div>
      <SummaryCounting
        v-for="(transactions, currency) in groppedByCurrency"
        :key="currency"
        :currency="currency"
        :transactions="transactions"
        class="mb-2"
      >
        <template v-slot:title>{{ currency }}</template>
      </SummaryCounting>
      <SummaryCounting
        currency="GEL"
        :useConversion="true"
        :transactions="store.transactions">
        <template v-slot:title>Итог по всем валютам в GEL</template>
      </SummaryCounting>
    </div>
    <template v-slot:actions>
      <OutlineButton class="ml-2" @click="$emit('close')">Закрыть</OutlineButton>
    </template>
  </SModal>
</template>

<style scoped></style>
