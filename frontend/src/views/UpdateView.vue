<script setup lang="ts">
import { getUpdateStatus, type UpdateStatus } from '@/api/getUpdateStatus'
import { startUpdate } from '@/api/startUpdate'
import OutlineButton from '@/components/ui/OutlineButton.vue'
import { useVersionStore } from '@/stores/version'
import { ref } from 'vue'

const store = useVersionStore()

const status = ref<UpdateStatus>()

const update = async () => {
  try {
    await startUpdate()
    status.value = { status: 'idle', error: null }

    const interval = setInterval(async () => {
      try {
        status.value = await getUpdateStatus()

        if (status.value.status === 'error' || status.value.status === 'done') {
          clearInterval(interval)
        }
        if (status.value.status === 'idle') {
          status.value.status = 'done'
          clearInterval(interval)
        }
      } catch (error) {
        // App can be reloaded so we can get network error, so we will just log it and keep trying until we get a response
        console.log('Error during update status check:', error)
      }
    }, 1000)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    status.value = { status: 'error', error: 'Ошибка, попробуйте позже' }
  }
}
</script>

<template>
  <div class="m-5">
    <h1 class="text-lime-600 text-xl font-bold mb-3">Update info</h1>
    <p>
      Текущая версия приложения: {{ store.versionInfo?.currentVersion }}. Последняя доступная
      версия: {{ store.versionInfo?.latestVersion }}.
    </p>
    <div class="mt-2">
      <OutlineButton :disabled="!store.needUpdate" @click="update()">Обновить</OutlineButton>
    </div>
    <div v-if="status" class="mt-4 p-4">
      <p class="font-semibold mb-2 text-lime-600">Статус обновления: {{ status.status }}</p>
      <p v-if="status.error" class="text-red-500">Ошибка: {{ status.error }}</p>
      <p v-if="status.status === 'downloading'" class="">
        Загрузка обновления: {{ status.downloadedMB?.toFixed(1) || 0 }} /
        {{ status.totalSizeMB?.toFixed(1) || 0 }} MB ({{ status.percent || 0 }}%)
      </p>
    </div>
  </div>
</template>

<style></style>
