# Pokedex

A simple Pokédex built with Vue 3, Pinia, Vue Router 4, and Bootstrap 5.3. Data from PokeAPI.

## Stack

- Vue 3 (Vite)
- Vue Router 4 (history mode, `scrollBehavior: () => ({ top: 0 })`)
- Pinia for state management
- Bootstrap 5.3.x for UI
- Native fetch API

## Routes

- `/` → `PokedexView.vue`
- `/pokemon/:idOrName` → `PokemonDetailView.vue`

## State

- `usePokedexStore` → list, filters, `editsById` (nickname/favorite/notes) with localStorage persistence
- `usePokemonStore` → per-Pokémon details/species cache with loading/error per key

## Run locally

```sh
gh repo clone Finn-TH/Pokedex
pnpm install
pnpm dev
```

## Build and preview

```sh
pnpm build
pnpm preview
```

## Acceptance checklist

- Exactly 100 Pokémon on list with search filter and responsive grid
- Card click navigates to details with meaningful sections (hero, about, abilities, base stats, flavor)
- Loaders and error handling for list and details
- Edits (nickname/favorite/notes) persisted locally and reflected immediately

### Architecture

- **`src/services/pokeApi.js`**: Handles API calls to fetch Pokémon data.
- **`src/stores/pokedex.js`**: Manages the Pokémon list and related state using Pinia.
- **`src/views/PokedexView.vue`**: Displays a searchable grid of Pokémon cards.
- **`src/views/PokemonDetailView.vue`**: Shows detailed information about a specific Pokémon.
- **`src/assets/main.css`**: Contains custom styles for the app.

### Error Handling

- Errors during API calls are stored in the `error` state of the Pinia store.
- If an error occurs, a user-friendly message is displayed in the UI.
