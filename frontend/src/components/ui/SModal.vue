<script setup lang="ts">
import OutlineButton from './OutlineButton.vue'

defineProps({
  isOpen: Boolean,
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="$emit('close')"
      >
        <div
          class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
        >
          <button
            @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            ✕
          </button>

          <div class="mt-2">
            <slot>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Заголовок</h3>
              <p class="mt-2 text-sm text-gray-500">Основной текст модального окна.</p>
            </slot>
          </div>

          <div class="mt-6 flex justify-end">
            <slot name="actions">
              <OutlineButton @click="$emit('close')">Закрыть</OutlineButton>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped></style>
