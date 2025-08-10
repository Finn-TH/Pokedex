const API = 'https://pokeapi.co/api/v2'

async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchPokemonList(limit = 100, offset = 0) {
  const data = await getJson(`${API}/pokemon?limit=${limit}&offset=${offset}`)
  return data.results.map(({ name, url }) => {
    const id = Number(url.split('/').filter(Boolean).pop())
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    return { id, name, imageUrl }
  })
}
