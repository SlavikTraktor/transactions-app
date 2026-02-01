<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import ToggleSwitch from 'primevue/toggleswitch'
import { computed, ref } from 'vue'
import BaseFilter from './BaseFilter.vue'
import { useTransactionsFiltersStore } from '@/stores/transactionsFilters'
import { endOfMonth, startOfDay, startOfMonth } from 'date-fns'

const store = useTransactionsFiltersStore()
const dateRange = ref<[Date, Date | null] | undefined>(store.dateRange)
const month = ref<Date | undefined>(store.dateRange ? store.dateRange[0] : undefined)

const resDateRange = computed(() => {
  if (!store.isMonthlyView) {
    return dateRange.value
  }

  if (!month.value) {
    return undefined
  }

  const start = startOfMonth(month.value)
  const end = startOfDay(endOfMonth(month.value))
  return [start, end]
})

function clear() {
  dateRange.value = undefined
  month.value = undefined
}

defineExpose({ value: resDateRange, clear })
</script>

<template>
  <BaseFilter>
    <template v-slot:title>Диапазон дат:</template>
    <div class="flex items-center mb-2">
      <ToggleSwitch inputId="monthlyView" v-model="store.isMonthlyView" />
      <label for="monthlyView" class="text-sm text-gray-400 pl-2 cursor-pointer"
        >Выбор по месяцу</label
      >
    </div>
    <DatePicker
      v-if="!store.isMonthlyView"
      v-model="dateRange"
      selectionMode="range"
      :manualInput="false"
      showClear
      :hideOnRangeSelection="true"
      fluid
    />
    <DatePicker
      v-if="store.isMonthlyView"
      v-model="month"
      :manualInput="false"
      view="month"
      showClear
      dateFormat="mm/yy"
      fluid
    />
  </BaseFilter>
</template>

<style scoped></style>
