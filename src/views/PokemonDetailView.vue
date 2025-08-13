<script setup>
import { computed, onMounted, watch, reactive } from 'vue'
import { usePokedexStore } from '../stores/pokedex'
import { useRoute } from 'vue-router'
import { usePokemonStore } from '../stores/pokemon'
import { getEnglishFlavorText } from '../services/pokeApi'

const route = useRoute()
const store = usePokemonStore()
const pokedex = usePokedexStore()
const form = reactive({ nickname: '', favorite: false, notes: '' })

const key = computed(() => String(route.params.idOrName).toLowerCase())

const detail = computed(() => {
  const v = route.params.idOrName
  const n = Number(v)
  if (!Number.isNaN(n)) return store.getById(n)
  const lower = String(v).toLowerCase()
  return Object.values(store.byId).find((d) => d.name === lower) || null
})
const id = computed(() => detail.value?.id ?? null)
const species = computed(() => (id.value ? store.getSpeciesById(id.value) : null))

watch(
  id,
  (n) => {
    const e = n ? pokedex.editsById[n] || {} : {}
    form.nickname = e.nickname || ''
    form.favorite = !!e.favorite
    form.notes = e.notes || ''
  },
  { immediate: true },
)

function saveEdit() {
  if (!id.value) return
  pokedex.setEdit(id.value, { ...form })
}

async function load() {
  const d = await store.fetchDetails(route.params.idOrName)
  await store.fetchSpecies(d.id)
}

onMounted(load)
watch(() => route.params.idOrName, load)
</script>

<template>
  <div class="container py-4">
    <h1 class="mb-3">Pokemon Details</h1>

    <div v-if="store.getStatus(key) === 'loading'" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div
      v-else-if="store.getStatus(key) === 'error'"
      class="alert alert-danger d-flex justify-content-between"
    >
      <div>{{ store.getError(key) }}</div>
      <button class="btn btn-sm btn-outline-light" @click="load()">Retry</button>
    </div>

    <div v-else-if="detail">
      <!-- Hero -->
      <div class="row align-items-center mb-4">
        <div class="col-12 col-md-4">
          <div class="ratio ratio-1x1 bg-light rounded">
            <img
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${detail.id}.png`"
              :alt="`Official artwork of ${detail.name}`"
              class="object-fit-contain p-2 img-fluid"
            />
          </div>
        </div>
        <div class="col">
          <h2 class="text-capitalize mb-1">
            {{ pokedex.editsById[detail.id]?.nickname || detail.name }}
            <span class="badge text-bg-secondary ms-2">#{{ detail.id }}</span>
            <button
              class="btn btn-outline-light btn-sm ms-2"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#editModal"
            >
              Edit
            </button>
          </h2>
          <div class="text-muted">Types: {{ detail.types.map((t) => t.type.name).join(', ') }}</div>
          <span v-if="pokedex.editsById[detail.id]?.favorite" class="ms-2" aria-label="Favorite"
            >⭐</span
          >
        </div>
      </div>

      <!-- About + Abilities -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="card p-3">
            <div class="small text-muted">Height</div>
            <div class="fw-semibold">{{ (detail.height / 10).toFixed(1) }} m</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card p-3">
            <div class="small text-muted">Weight</div>
            <div class="fw-semibold">{{ (detail.weight / 10).toFixed(1) }} kg</div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="card p-3">
            <div class="small text-muted">Abilities</div>
            <div class="fw-semibold text-capitalize">
              {{ detail.abilities.map((a) => a.ability.name).join(', ') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Base stats -->
      <div class="card p-3 mb-4">
        <h5 class="mb-3">Base Stats</h5>
        <div v-for="s in detail.stats" :key="s.stat.name" class="mb-2">
          <div class="d-flex justify-content-between">
            <span class="text-capitalize">{{ s.stat.name }}</span>
            <span>{{ s.base_stat }}</span>
          </div>
          <div class="progress" style="height: 8px">
            <div
              class="progress-bar"
              role="progressbar"
              :style="{ width: (s.base_stat / 255) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Flavor text -->
      <div class="card p-3">
        <h5 class="mb-3">Flavor</h5>
        <div v-if="id && store.getStatus(`species:${id}`) === 'loading'" class="text-center my-2">
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div
          v-else-if="id && store.getStatus(`species:${id}`) === 'error'"
          class="alert alert-warning"
        >
          {{ store.getError(`species:${id}`) }}
          <button class="btn btn-sm btn-outline-secondary ms-2" @click="store.fetchSpecies(id)">
            Retry
          </button>
        </div>
        <p v-else-if="species" class="mb-0">
          {{ getEnglishFlavorText(species) }}
        </p>
        <p v-else class="text-muted mb-0">No flavor text available.</p>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="editModal"
    tabindex="-1"
    aria-hidden="true"
    aria-labelledby="editModalLabel"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="editModalLabel" class="modal-title">Edit</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Nickname</label>
            <input v-model="form.nickname" class="form-control" placeholder="Optional nickname" />
          </div>
          <div class="form-check mb-3">
            <input id="fav" v-model="form.favorite" class="form-check-input" type="checkbox" />
            <label for="fav" class="form-check-label">Favorite</label>
          </div>
          <div>
            <label class="form-label">Notes</label>
            <textarea
              v-model="form.notes"
              class="form-control"
              rows="3"
              placeholder="Anything you want to remember..."
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="saveEdit">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
