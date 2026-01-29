<script setup lang="ts">
import OutlineButton from '../ui/OutlineButton.vue';
import SModal from '../ui/SModal.vue';

defineProps({
  isOpen: Boolean,
})

defineEmits(['close'])
</script>

<template>
  <SModal :isOpen="isOpen" @close="$emit('close')">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Фильтры</h3>
      <p class="mt-2 text-sm text-gray-500">Тут будут фильтры</p>
      <template v-slot:actions>
        <OutlineButton @click="$emit('close')">Очистить</OutlineButton>
        <OutlineButton class="ml-2" @click="$emit('close')">Применить</OutlineButton>
      </template>
    </SModal>
</template>

<style scoped></style>
