<script setup>
import { onMounted, ref, watch } from 'vue'
import { usePokedexStore } from '../stores/pokedex'
const store = usePokedexStore()
const input = ref(store.query)
let t
watch(input, (v) => {
  clearTimeout(t)
  t = setTimeout(() => store.setQuery(v), 200)
})

onMounted(() => {
  store.fetchList()
})
</script>

<template>
  <div class="container py-4">
    <h1 class="mb-3">Pokedex</h1>

    <input v-model="input" class="form-control mb-3" placeholder="Search Pokemon..." />

    <div v-if="store.status === 'loading'" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div
      v-else-if="store.status === 'error'"
      class="alert alert-danger d-flex justify-content-between"
    >
      <div>{{ store.error }}</div>
      <button class="btn btn-sm btn-outline-light" @click="store.fetchList()">Retry</button>
    </div>
    <div v-else class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
      <div v-for="p in store.filteredItems" :key="p.id" class="col">
        <div class="card h-100 text-center">
          <div class="ratio ratio-1x1">
            <img
              :src="p.imageUrl"
              :alt="`Pokemon ${p.name} official artwork`"
              class="object-fit-contain p-2 img-fluid"
              loading="lazy"
            />
          </div>
          <div class="card-body p-2">
            <h6 class="mb-0 text-capitalize">{{ p.name }}</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
