<script setup lang="ts">
import STh from '../ui/Table/STh.vue'
import { useTransactionsFiltersStore } from '@/stores/transactionsFilters'

const props = defineProps<{
  name: string
}>()

const store = useTransactionsFiltersStore()

const toggleOrder = () => {
  if (store.order.orderBy === props.name) {
    store.order = {
      orderBy: props.name,
      order: store.order.order === 'asc' ? 'desc' : 'asc',
    }
  } else {
    store.order = {
      orderBy: props.name,
      order: 'desc',
    }
  }
}
</script>

<template>
  <STh>
    <span class="hover:text-lime-600 hover:cursor-pointer" @click="toggleOrder">
      <span class="pr-1">
        <slot>Name</slot>
      </span>
      <span class="text-lime-400">
        {{ store.order.orderBy === props.name ? (store.order.order === 'asc' ? '▲' : '▼') : '' }}
      </span>
    </span>
  </STh>
</template>

<style scoped></style>
