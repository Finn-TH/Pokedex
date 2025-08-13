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
pnpm install
pnpm dev
```

## Build and preview

```sh
pnpm build
pnpm preview
```

## Lint/format

```sh
pnpm lint
pnpm format
```

## Deployment

Recommended: Netlify. Deploy the Vite build output (`dist/`). Ensure SPA fallback to `/index.html`.

### Netlify SPA fallback

Add `public/_redirects` with:

```
/* /index.html 200
```

## Acceptance checklist

- Exactly 100 Pokémon on list with search filter and responsive grid
- Card click navigates to details with meaningful sections (hero, about, abilities, base stats, flavor)
- Loaders and error handling for list and details
- Edits (nickname/favorite/notes) persisted locally and reflected immediately
- Public repo, documented, deployed with SPA fallback

## Architecture notes

- Images derived via id using official artwork URL
- List fetch limited to 100; details/species fetched on demand and cached
- Search is debounced (~200ms) and case-insensitive on name
