import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CurrencyUnion } from '@/types/currencyUnion'

export const useConversionStore = defineStore('conversion', () => {
  const currency = ref<CurrencyUnion>('GEL')

  return { currency }
})
