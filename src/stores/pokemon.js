import { defineStore } from 'pinia'
import { fetchPokemonDetails, fetchPokemonSpecies } from '../services/pokeApi'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    byId: {},
    speciesById: {},
    status: {}, // key → 'idle' | 'loading' | 'success' | 'error'
    error: {}, // key → message
    _inflight: {},
  }),
  getters: {
    getById: (s) => (id) => s.byId[id] || null,
    getSpeciesById: (s) => (id) => s.speciesById[id] || null,
    getStatus: (s) => (key) => s.status[key] || 'idle',
    getError: (s) => (key) => s.error[key] || null,
  },
  actions: {
    async fetchDetails(idOrName) {
      const key = String(idOrName).toLowerCase()
      if (this.status[key] === 'loading') return this._inflight[key]
      if (typeof idOrName === 'number' && this.byId[idOrName]) return this.byId[idOrName]

      this.status[key] = 'loading'
      this.error[key] = null
      const p = (async () => {
        try {
          const data = await fetchPokemonDetails(idOrName)
          this.byId[data.id] = data
          this.status[data.id] = 'success'
          return data
        } catch (e) {
          this.error[key] = e?.message || 'Failed to load details'
          this.status[key] = 'error'
          throw e
        } finally {
          delete this._inflight[key]
        }
      })()
      this._inflight[key] = p
      return p
    },
    async fetchSpecies(id) {
      const speciesKey = `species:${id}`
      if (this.speciesById[id]) return this.speciesById[id]
      if (this.status[speciesKey] === 'loading') return this._inflight[speciesKey]

      this.status[speciesKey] = 'loading'
      this.error[speciesKey] = null
      const p = (async () => {
        try {
          const data = await fetchPokemonSpecies(id)
          this.speciesById[id] = data
          this.status[speciesKey] = 'success'
          return data
        } catch (e) {
          this.error[speciesKey] = e?.message || 'Failed to load species'
          this.status[speciesKey] = 'error'
          throw e
        } finally {
          delete this._inflight[speciesKey]
        }
      })()
      this._inflight[speciesKey] = p
      return p
    },
  },
})
