<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<template>
  <button
    :class="[
      'px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200',
      {
        'bg-gray-50': attrs.disabled,
        'hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 bg-white cursor-pointer': !attrs.disabled,
      },
    ]"
  >
    <slot />
  </button>
</template>

<style scoped></style>
