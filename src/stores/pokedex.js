import { defineStore } from 'pinia'
import { fetchPokemonList } from '../services/pokeApi'

export const usePokedexStore = defineStore('pokedex', {
  state: () => ({
    items: [],
    status: 'idle', // idle, loading, error or success
    error: null,
    query: '',
  }),
  getters: {
    filteredItems: (s) => {
      const q = s.query.trim().toLowerCase()
      return q ? s.items.filter((i) => i.name.toLowerCase().includes(q)) : s.items
    },
  },
  actions: {
    async fetchList() {
      if (this.status === 'loading' || this.items.length) return
      this.status = 'loading'
      this.error = null
      try {
        this.items = await fetchPokemonList()
        this.status = 'success'
      } catch (e) {
        this.error = e?.message || 'Failed to load Pokemon'
        this.status = 'error'
      }
    },
    setQuery(q) {
      this.query = q
    },
  },
})
