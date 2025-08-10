<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container"><RouterLink class="navbar-brand" to="/">Pokedex</RouterLink></div>
  </nav>
  <RouterView />
</template>
