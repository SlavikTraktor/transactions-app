import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getVersionInfo, type VersionInfo } from '@/api/getVersionInfo'

export const useVersionStore = defineStore('version', () => {
  const versionInfo = ref<VersionInfo | null>(null)

  const needUpdate = computed(() => {
    if(!versionInfo.value) return false
    return versionInfo.value?.currentVersion !== versionInfo.value?.latestVersion
  })

  const initVersionInfo = async () => {
    try {
      versionInfo.value = await getVersionInfo()
    } catch (error) {
      console.error('Ошибка при получении информации о версии:', error)
    }
  }

  return { versionInfo, needUpdate, initVersionInfo }
})
