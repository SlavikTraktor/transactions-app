<script setup lang="ts">
import STh from './ui/Table/STh.vue';

import Select from 'primevue/select';
import { useConversionStore } from '@/stores/conversionStore';

const store = useConversionStore()

const currencies = ['GEL', 'USD', 'EUR', 'RUB'];

</script>

<template>
  <STh><span class="mr-2">Amount</span> 
    <Select class="w-[89px]" v-model="store.currency" :options="currencies" size="small" />
  </STh>
</template>

<style scoped></style>
