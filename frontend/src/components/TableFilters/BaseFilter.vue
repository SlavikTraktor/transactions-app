<script setup lang="ts"></script>

<template>
  <div class="p-1">
    <div class="text-sm text-gray-500 mb-1">
      <slot name="title">Описание фильтра</slot>
    </div>
    <slot>ФИЛЬТР</slot>
  </div>
</template>

<style scoped></style>
