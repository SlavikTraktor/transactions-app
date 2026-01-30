<script setup lang="ts">
import MultiSelect from 'primevue/multiselect'
import { ref } from 'vue'
import BaseFilter from './BaseFilter.vue';
import { useTransactionsFiltersStore } from '@/stores/transactionsFilters';

const store = useTransactionsFiltersStore()
const currencies = ref<string[] | undefined>(store.currencies);

defineExpose({ value: currencies, clear });

function clear() {
  currencies.value = undefined
}

const options = ['USD', 'EUR', 'RUB', 'GEL'];

</script>

<template>
  <BaseFilter>
    <template v-slot:title>Валюта:</template>
    <MultiSelect v-model="currencies" :options="options" :showToggleAll="false" fluid />
  </BaseFilter>
</template>

<style scoped></style>
