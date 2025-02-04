<template>
  <div class="container">
    <!-- Carousel -->
    <carrusel />

    <!-- Buscador de Canciones -->
    <div class="search-bar">
      <input v-model="searchQuery" @keyup.enter="buscarCanciones" placeholder="Buscar canciones..." />
      <button @click="buscarCanciones">Buscar</button>
    </div>

    <!-- Resultados de la Búsqueda -->
    <div v-if="searchResults.length > 0" class="search-results">
      <h2>Resultados de la Búsqueda</h2>
      <div class="playlist">
        <div v-for="song in searchResults" :key="song.id" class="playlist-item">
          <img :src="song.album.cover" alt="Portada del álbum" class="album-cover" />
          <div class="song-details">
            <strong>{{ song.title }}</strong>
            <p>{{ song.artist.name }}</p>
            <p>{{ song.album.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top 8 Canciones Más Escuchadas -->
    <h1>Top 8 Canciones Más Escuchadas</h1>
    <div class="playlist" v-if="topSongs.length > 0">
      <div v-for="song in topSongs" :key="song.id" class="playlist-item">
        <img :src="song.album.cover" alt="Portada del álbum" class="album-cover" />
        <div class="song-details">
          <strong>{{ song.title }}</strong>
          <p>{{ song.artist.name }}</p>
          <p>{{ song.album.title }}</p>
          <p>{{ formatDuration(song.duration) }}</p>
          <audio :src="song.preview" controls></audio>
          <button @click="addSongToPlaylist(song)">Añadir canción</button>
        </div>
      </div>
    </div>
    <p v-else>No hay canciones disponibles</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import carrusel from '../components/carrusel.vue';
import { useFavoritesStore } from '../stores/favorito.js';

const searchQuery = ref('');
const topSongs = ref([]);
const searchResults = ref([]);
const favoritesStore = useFavoritesStore();

const buscarCanciones = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/https://api.deezer.com/search?q=${searchQuery.value}`, {
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      }
    });
    searchResults.value = response.data.data;
  } catch (error) {
    console.error('Error al buscar las canciones:', error);
  }
};

const fetchTopSongs = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/https://api.deezer.com/chart`, {
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      }
    });
    topSongs.value = response.data.tracks.data.slice(0, 8);
  } catch (error) {
    console.error('Error al cargar las canciones:', error);
  }
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${minutes}:${sec.toString().padStart(2, '0')}`;
};

const addSongToPlaylist = (song) => {
  favoritesStore.addSong(song);
};

onMounted(fetchTopSongs);
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1, h2 {
  color: #007bff;
  text-align: center;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 500px;
}

.search-bar button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.playlist {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.playlist-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  max-width: 250px; /* Incremento del ancho */
}

.album-cover {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
}

.song-details {
  text-align: center;
}

.song-details strong {
  display: block;
  margin-bottom: 5px;
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0056b3;
}
</style>
