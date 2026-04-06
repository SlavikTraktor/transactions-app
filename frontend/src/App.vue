<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import UpdateRouterLink from './components/Header/UpdateRouterLink.vue'

</script>

<template>
  <Toaster />
  <header>
    <div class="wrapper">
      <nav class="m-5">
        <RouterLink class="pr-3 hover:text-lime-600 duration-300" to="/">Home</RouterLink>
        <RouterLink class="pr-3 hover:text-lime-600 duration-300" to="/about">About</RouterLink>
        <UpdateRouterLink />
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
