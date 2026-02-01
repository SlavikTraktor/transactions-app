<script setup lang="ts">
import MultiSelect from 'primevue/multiselect'
import { ref } from 'vue'
import BaseFilter from './BaseFilter.vue'
import { useTransactionsFiltersStore } from '@/stores/transactionsFilters'

const store = useTransactionsFiltersStore()
const sources = ref<string[] | undefined>(store.sources)

defineExpose({ value: sources, clear })

function clear() {
  sources.value = undefined
}

const options = [
  { name: 'BoG', code: 'bog' },
  { name: 'BoG Business', code: 'bog_business' },
  { name: 'Paypal', code: 'paypal' },
  { name: 'Tinkoff', code: 'tinkoff' },
]
</script>

<template>
  <BaseFilter>
    <template v-slot:title>Источник:</template>
    <MultiSelect v-model="sources" :options="options" :showToggleAll="false" fluid  optionLabel="name" optionValue="code" />
  </BaseFilter>
</template>

<style scoped></style>
