<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import carrusel from '../components/carrusel.vue';
import { useFavoritesStore } from '../stores/favorito.js';
import { useMainStore } from '@/stores/busqueda';

const searchQuery = ref('');
const topAlbums = ref([]);
const topArtists = ref([]);
const searchResults = ref({ songs: [], artists: [], albums: [] });
const favoritesStore = useFavoritesStore();
const store = useMainStore();
const router = useRouter();

const buscar = async () => {
  try {
    const [songsResponse, artistsResponse, albumsResponse] = await Promise.all([
      axios.get(`http://localhost:8080/https://api.deezer.com/search/track?q=${searchQuery.value}&limit=10`),
      axios.get(`http://localhost:8080/https://api.deezer.com/search/artist?q=${searchQuery.value}&limit=10`),
      axios.get(`http://localhost:8080/https://api.deezer.com/search/album?q=${searchQuery.value}&limit=10`)
    ]);
    
    searchResults.value = {
      songs: songsResponse.data.data,
      artists: artistsResponse.data.data,
      albums: albumsResponse.data.data
    };
  } catch (error) {
    console.error('Error al buscar:', error);
    alert('Hubo un problema al realizar la búsqueda.');
  }
};

const fetchTopAlbumsAndArtists = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/https://api.deezer.com/chart`, {
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      }
    });
    topAlbums.value = response.data.albums.data.slice(0, 5);
    topArtists.value = response.data.artists.data.slice(0, 5);
  } catch (error) {
    console.error('Error al cargar los álbumes y artistas:', error);
    alert('Hubo un problema al cargar los álbumes y artistas. Por favor, inténtalo de nuevo más tarde.');
  }
};

const viewAlbumDetails = (album) => {
  store.currentAlbum = album;
  router.push({ name: 'AlbumDetails', params: { id: album.id } });
};

const viewArtist = (artistId) => {
  router.push({ name: 'Artist', params: { id: artistId } });
};

const viewSong = (song) => {
  router.push({ name: 'SongDetails', params: { id: song.id }, query: { title: song.title, cover: song.album.cover, artist: song.artist.name } });
};

onMounted(fetchTopAlbumsAndArtists);
</script>

<template>
  <div class="container text-center">
    <carrusel />
    <br>
    <br>
    <div class="input-group mb-4 w-50 mx-auto">
      <input v-model="searchQuery" @keyup.enter="buscar" class="form-control" placeholder="Buscar canciones, artistas o álbumes..." />
      <button class="btn btn-primary" @click="buscar">Buscar</button>
    </div>

    <div v-if="searchResults.songs.length || searchResults.artists.length || searchResults.albums.length" class="search-results">
      <h2 class="my-3">Resultados de la Búsqueda</h2>

      <div class="grid-container">
        <div v-if="searchResults.artists.length">
          <h3>Artistas</h3>
          <div class="row row-cols-5 g-3">
            <div v-for="artist in searchResults.artists" :key="artist.id" class="col" @click="viewArtist(artist.id)">
              <div class="card p-2">
                <img :src="artist.picture_medium" alt="Imagen del artista" class="card-img-top rounded-circle" />
                <p class="card-text mt-2"><strong>{{ artist.name }}</strong></p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="searchResults.songs.length">
          <h3>Canciones</h3>
          <div class="row row-cols-5 g-3">
            <div v-for="song in searchResults.songs" :key="song.id" class="col" @click="viewSong(song)">
              <div class="card p-2">
                <img :src="song.album.cover_medium" alt="Portada del álbum" class="card-img-top" />
                <p class="card-text mt-2"><strong>{{ song.title }}</strong> - {{ song.artist.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="searchResults.albums.length">
          <h3>Álbumes</h3>
          <div class="row row-cols-5 g-3">
            <div v-for="album in searchResults.albums" :key="album.id" class="col" @click="viewAlbumDetails(album)">
              <div class="card p-2">
                <img :src="album.cover_medium" alt="Portada del álbum" class="card-img-top" />
                <p class="card-text mt-2"><strong>{{ album.title }}</strong> - {{ album.artist.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h1 class="my-4">Top Álbumes Más Escuchados</h1>
    <div class="d-flex overflow-auto pb-3">
      <div v-for="album in topAlbums" :key="album.id" class="card mx-2 p-2" style="width: 12rem;" @click="viewAlbumDetails(album)">
        <img :src="album.cover_medium" alt="Portada del álbum" class="card-img-top" loading="lazy" />
        <div class="card-body text-center">
          <strong>{{ album.title }}</strong>
          <p class="card-text">{{ album.artist.name }}</p>
        </div>
      </div>
    </div>

    <h2 class="my-4">Top Artistas Más Escuchados</h2>
    <div class="d-flex overflow-auto pb-3">
      <div v-for="artist in topArtists" :key="artist.id" class="card mx-2 p-2" style="width: 12rem;" @click="viewArtist(artist.id)">
        <img :src="artist.picture_medium" alt="Imagen del artista" class="card-img-top rounded-circle" loading="lazy" />
        <div class="card-body text-center">
          <strong>{{ artist.name }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>
