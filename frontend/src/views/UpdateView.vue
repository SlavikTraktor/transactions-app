<script setup lang="ts">
import { getVersionInfo, type VersionInfo } from '@/api/getVersionInfo'
import { useVersionStore } from '@/stores/version';
import { onMounted, ref } from 'vue'

const store = useVersionStore();

const versionInfo = ref<VersionInfo | null>(null)

const fetchVersionInfo = async () => {
  try {
    versionInfo.value = await getVersionInfo()
  } catch (error) {
    console.error('Ошибка при получении информации о версии:', error)
  }
}

onMounted(() => {
  fetchVersionInfo()
})
</script>

<template>
  <div class="m-5">
    <h1 class="text-lime-600 text-xl font-bold mb-3">Update info</h1>
    <p>
      Текущая версия приложения: {{ store.versionInfo?.currentVersion }}. Последняя доступная версия:
      {{ store.versionInfo?.latestVersion }}.
    </p>
  </div>
</template>

<style></style>
