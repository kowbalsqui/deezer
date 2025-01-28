<template>
  <!-- Carousel -->
  <carrusel />
  <div class="container">
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

    <!-- Top 9 Canciones Más Escuchadas -->
    <h1>Top 9 Canciones Más Escuchadas</h1>
    <div class="playlist" v-if="topSongs.length > 0">
      <div v-for="song in topSongs" :key="song.id" class="playlist-item">
        <img :src="song.album.cover" alt="Portada del álbum" class="album-cover" />
        <div class="song-details">
          <strong>{{ song.title }}</strong>
          <p>{{ song.artist.name }}</p>
          <p>{{ song.album.title }}</p>
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
import { useFavoritesStore } from '../stores/favorito.js'; // Importa el store de favoritos

const searchQuery = ref('');
const topSongs = ref([]);
const searchResults = ref([]);
const favoritesStore = useFavoritesStore(); // Instancia del store de favoritos

// Función para buscar canciones
const buscarCanciones = async () => {
  try {
    const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${searchQuery.value}`);
    searchResults.value = response.data.data;
  } catch (error) {
    console.error('Error al buscar las canciones:', error);
  }
};

// Función para obtener las 9 canciones más escuchadas
const fetchTopSongs = async () => {
  try {
    const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/chart`);
    topSongs.value = response.data.tracks.data.slice(0, 9);
  } catch (error) {
    console.error('Error al cargar las canciones:', error);
  }
};

onMounted(fetchTopSongs);
</script>

<style scoped>
h1, h2 {
  color: #007bff;
}
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
  flex-direction: column;
  gap: 20px;
  justify-content: center;
}
.playlist-item {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  width: 100%;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
.album-cover {
  width: 60px;
  height: auto;
  border-radius: 10px;
  margin-right: 20px;
}
.song-details {
  flex: 1;
}
.search-results {
  margin-bottom: 40px;
}
</style>
