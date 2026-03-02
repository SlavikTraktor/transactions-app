<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>

<template>
  <span class="bg-gray-200 px-1.5 rounded-full cursor-pointer font-semibold" v-tooltip.top="props.text"> ? </span>
</template>

<style scoped></style>
