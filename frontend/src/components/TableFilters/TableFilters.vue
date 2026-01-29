<script setup lang="ts">
import OutlineButton from '../ui/OutlineButton.vue'
import SModal from '../ui/SModal.vue'
import DateRangeFilter from './DateRangeFilter.vue';

defineProps({
  isOpen: Boolean,
})

defineEmits(['close'])
</script>

<template>
  <SModal :isOpen="isOpen" @close="$emit('close')">
    <DateRangeFilter />
    <template v-slot:actions>
      <OutlineButton @click="$emit('close')">Очистить</OutlineButton>
      <OutlineButton class="ml-2" @click="$emit('close')">Применить</OutlineButton>
    </template>
  </SModal>
</template>

<style scoped></style>
