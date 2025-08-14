import { defineStore } from 'pinia'
import { fetchPokemonList } from '../services/pokeApi'

/**
 * Pinia store for managing the Pokémon list and related state.
 */

export const usePokedexStore = defineStore('pokedex', {
  state: () => ({
    items: [],
    status: 'idle', // idle, loading, error or success
    error: null,
    query: '',
    editsById: {},
    _persistentReady: false,
  }),
  getters: {
    decoratedItems: (s) =>
      s.items.map((i) => {
        const e = s.editsById[i.id] || {}
        const nickname = (e.nickname || '').trim()
        return {
          ...i,
          nickname,
          favorite: !!e.favorite,
          notes: e.notes || '',
          displayName: nickname || i.name,
        }
      }),
    /* Filters the Pokémon list based on a search query. */
    filteredItems: (s) => {
      const q = s.query.trim().toLowerCase()
      const list = s.decoratedItems
      return q ? list.filter((i) => i.name.toLowerCase().includes(q)) : list
    },
  },
  actions: {
    /* Fetches the Pokémon list from the API and updates the store state. */
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
    /* Updates the edits for a specific Pokémon by ID. */
    setEdit(id, patch) {
      const current = this.editsById[id] || {}
      this.editsById[id] = { ...current, ...patch }
    },
    toggleFavorite(id) {
      const current = this.editsById[id] || {}
      this.editsById[id] = { ...current, favorite: !current.favorite }
    },
    init() {
      if (this._persistentReady) return
      const KEY = 'pokedex_edits_v1'
      try {
        const raw = localStorage.getItem(KEY)
        if (raw) this.editsById = JSON.parse(raw) || {}
      } catch (e) {
        console.error('Failed to read pokedex edits from localStorage', e)
      }

      this.$subscribe((mutation, state) => {
        try {
          localStorage.setItem(KEY, JSON.stringify(state.editsById))
        } catch (e) {
          console.error('Failed to write pokedex edits to localStorage', e)
        }
      })
      this._persistentReady = true
    },
  },
})
