<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import { ref } from 'vue'
import BaseFilter from './BaseFilter.vue';

const dateRange = ref<[Date, Date | null]>()

</script>

<template>
  <BaseFilter>
    <template v-slot:title>Диапазон дат:</template>
    <DatePicker v-model="dateRange" selectionMode="range" :manualInput="false" showClear :hideOnRangeSelection="true" fluid />
  </BaseFilter>
</template>

<style scoped></style>
