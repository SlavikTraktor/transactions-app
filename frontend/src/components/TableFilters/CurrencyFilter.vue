<script setup lang="ts">
import MultiSelect from 'primevue/multiselect'
import { ref } from 'vue'
import BaseFilter from './BaseFilter.vue';

const currencies = ref<string[]>();

</script>

<template>
  <BaseFilter>
    <template v-slot:title>Валюта:</template>
    <MultiSelect v-model="currencies" :options="['USD', 'EUR', 'RUB', 'GEL']" :showToggleAll="false" fluid />
  </BaseFilter>
</template>

<style scoped></style>
