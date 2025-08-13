<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { usePokedexStore } from './stores/pokedex'
onMounted(() => {
  usePokedexStore().init()
})
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container"><RouterLink class="navbar-brand" to="/">Pokedex</RouterLink></div>
  </nav>
  <RouterView />
</template>
