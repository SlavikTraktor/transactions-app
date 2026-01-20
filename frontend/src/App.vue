<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner';

// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <Toaster />
  <header>
    <div class="wrapper">
      <!-- <HelloWorld msg="You did it!" /> -->

      <nav class="m-5">
        <RouterLink class="pr-3 hover:text-red-700 duration-300" to="/">Home</RouterLink>
        <RouterLink class="hover:text-red-700 duration-300" to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
