<script setup lang="ts">
import { useVersionStore } from '@/stores/version'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
const store = useVersionStore()

onMounted(() => {
  store.initVersionInfo()
})
</script>

<template>
  <RouterLink
    class="pr-3 hover:text-lime-600 duration-300"
    :class="{ 'font-semibold': store.needUpdate }"
    to="/update"
    >Update<span v-if="store.needUpdate" class="text-amber-500">*</span></RouterLink
  >
</template>

<style scoped></style>
