<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import { ref } from 'vue'
import BaseFilter from './BaseFilter.vue';
import { useTransactionsFiltersStore } from '@/stores/transactionsFilters'

const store = useTransactionsFiltersStore()
const dateRange = ref<[Date, Date | null] | undefined>(store.dateRange)

function clear() {
  dateRange.value = undefined
}

defineExpose({ value : dateRange, clear });

</script>

<template>
  <BaseFilter>
    <template v-slot:title>Диапазон дат:</template>
    <DatePicker v-model="dateRange" selectionMode="range" :manualInput="false" showClear :hideOnRangeSelection="true" fluid />
  </BaseFilter>
</template>

<style scoped></style>
