<script setup lang="ts">
</script>

<template>
  <button
    :class="['px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer']"
  >
    <slot />
  </button>
</template>

<style scoped></style>
