<script setup lang="ts">
import { ref } from 'vue'
import OutlineButton from '../ui/OutlineButton.vue'
import TableFilters from './TableFilters.vue'

const isModalOpen = ref<boolean>(false)

const openModal = () => {
  isModalOpen.value = true
}
</script>

<template>
  <OutlineButton class="mb-2" @click="() => openModal()">Фильтры</OutlineButton>
  <TableFilters :isOpen="isModalOpen" @close="isModalOpen = false" />
</template>

<style scoped></style>
