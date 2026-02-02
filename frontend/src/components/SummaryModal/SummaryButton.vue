<script setup lang="ts">
import { ref } from 'vue'
import OutlineButton from '../ui/OutlineButton.vue'
import SummaryModal from './SummaryModal.vue'

const isModalOpen = ref<boolean>(false)

const openModal = () => {
  isModalOpen.value = true
}

</script>

<template>
  <OutlineButton @click="() => openModal()">
    Суммарно
  </OutlineButton>
  <SummaryModal :isOpen="isModalOpen" @close="isModalOpen = false" />
</template>

<style scoped></style>
