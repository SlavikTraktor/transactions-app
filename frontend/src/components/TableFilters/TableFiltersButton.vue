<script setup lang="ts">
import { ref, computed } from 'vue'
import OutlineButton from '../ui/OutlineButton.vue'
import TableFilters from './TableFilters.vue'
import { useTransactionsFiltersStore } from '@/stores/transactionsFilters'

const isModalOpen = ref<boolean>(false)

const openModal = () => {
  isModalOpen.value = true
}

const store = useTransactionsFiltersStore()

const filtersCountString = computed(() => {
  const count = store.activeFiltersCount
  return count > 0 ? `(${count})` : ''
})
</script>

<template>
  <OutlineButton @click="() => openModal()">
    Фильтры
    <span class="text-gray-400">{{ filtersCountString }}</span>
  </OutlineButton>
  <TableFilters :isOpen="isModalOpen" @close="isModalOpen = false" />
</template>

<style scoped></style>
