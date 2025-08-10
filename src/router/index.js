import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import PokemonDetailView from '../views/PokemonDetailView.vue'
import PokedexView from '../views/PokedexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pokedex',
      component: PokedexView,
    },
    {
      path: '/pokemon/:idOrName',
      name: 'pokemon',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: PokemonDetailView,
      props: true,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
