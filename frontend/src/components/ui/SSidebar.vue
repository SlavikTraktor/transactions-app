<script setup lang="ts">
defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="#modal">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 bg-black/40 z-40" @click="emit('close')" />
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="isOpen"
        class="fixed right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-50 p-6 overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Детали записи</h2>
          <button @click="emit('close')" class="px-2 py-1 hover:bg-gray-100 rounded-full cursor-pointer">✕</button>
        </div>

        <slot />
      </aside>
    </Transition>
  </Teleport>
</template>
