<script setup lang="ts">
import OutlineButton from '../ui/OutlineButton.vue'
import SModal from '../ui/SModal.vue'
import DateRangeFilter from './DateRangeFilter.vue'
import CurrencyFilter from './CurrencyFilter.vue'
import { ref } from 'vue'
import { useTransactionsFiltersStore } from '@/stores/transactionsFilters'
import SourceFilter from './SourceFilter.vue'

defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close'])

const store = useTransactionsFiltersStore()

const dateRangeFilter = ref<InstanceType<typeof DateRangeFilter>>()
const currencyFilter = ref<InstanceType<typeof CurrencyFilter>>()
const sourceFilter = ref<InstanceType<typeof SourceFilter>>()

function applyFilters() {
  store.dateRange = dateRangeFilter.value?.value
  store.currencies = currencyFilter.value?.value
  store.sources = sourceFilter.value?.value
  emit('close')
}

function clearFilters() {
  dateRangeFilter.value?.clear()
  currencyFilter.value?.clear()
  sourceFilter.value?.clear()
}
</script>

<template>
  <SModal :isOpen="isOpen" @close="$emit('close')">
    <div class="w-2/3">
      <DateRangeFilter ref="dateRangeFilter" />
      <CurrencyFilter ref="currencyFilter" />
      <SourceFilter ref="sourceFilter" />
    </div>
    <template v-slot:actions>
      <OutlineButton @click="clearFilters">Очистить</OutlineButton>
      <OutlineButton class="ml-2" @click="applyFilters">Применить</OutlineButton>
    </template>
  </SModal>
</template>

<style scoped></style>
