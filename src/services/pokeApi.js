const API = 'https://pokeapi.co/api/v2'

async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/* Fetches a list of Pokémon from the PokeAPI, limiting it to 100 requests */
export async function fetchPokemonList(limit = 100, offset = 0) {
  const data = await getJson(`${API}/pokemon?limit=${limit}&offset=${offset}`)
  return data.results.map(({ name, url }) => {
    const id = Number(url.split('/').filter(Boolean).pop())
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    return { id, name, imageUrl }
  })
}

/* Fetches additional details on the Pokémon */

export async function fetchPokemonDetails(idOrName) {
  return getJson(`${API}/pokemon/${idOrName}`)
}

export async function fetchPokemonSpecies(id) {
  return getJson(`${API}/pokemon-species/${id}`)
}

export function getEnglishFlavorText(species) {
  const entry = species?.flavor_text_entries?.find((e) => e.language.name === 'en')
  return entry ? entry.flavor_text.replace(/\f/g, ' ').replace(/\s+/g, ' ').trim() : ''
}
