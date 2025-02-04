import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue';
import PlaylistsView from '../views/PlaylistsView.vue';
import SearchView from '../views/SearchView.vue';
import ArtistView from '../views/ArtistView.vue';
import SongDetailsView from '../views/SongDetailsView.vue'; // Importamos SongDetailsView

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/playlists',
    name: 'Playlists',
    component: PlaylistsView,
  },
  {
    path: '/search',
    name: 'Buscador',
    component: SearchView,
  },
  {
    path: '/song/:id',  // Nueva ruta para ver los detalles de una canción
    name: 'SongDetails',
    component: SongDetailsView,
  },
  {
    path: '/artist/:id',
    name: 'Artist',
    component: ArtistView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
