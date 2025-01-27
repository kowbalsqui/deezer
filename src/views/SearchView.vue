<template>
  <div>
    <h1>Búsqueda de canciones en Deezer</h1>
    <!-- Componente hijo -->
    <SearchBar @results="handleResults" />
    <!-- Tarjetas de canciones -->
    <div class="song-cards" v-if="songs.length > 0">
      <div v-for="song in songs" :key="song.id" class="song-card">
        <img :src="song.album.cover" alt="Portada del álbum" class="album-cover" />
        <div class="song-details">
          <strong>{{ song.title }}</strong>
          <p>{{ song.artist.name }}</p>
          <p>{{ song.album.title }}</p>
          <p>{{ formatDuration(song.duration) }}</p>
          <audio :src="song.preview" controls></audio> <!-- Mini reproductor de audio -->
          <button @click="addSongToPlaylist(song)">Añadir canción</button> <!-- Pasar la canción como parámetro -->
        </div>
      </div>
    </div>
    <p v-else>No hay resultados para mostrar</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SearchBar from "../components/SearchBar.vue"; // Importa el componente hijo
import { useFavoritesStore } from "../stores/favorito.js"; // Importa el store de favoritos

const songs = ref([]); // Estado para almacenar la lista de canciones
const favoritesStore = useFavoritesStore(); // Instancia del store de favoritos

// Maneja los resultados emitidos por el componente hijo
const handleResults = (data) => {
  songs.value = data; // Actualiza la lista de canciones
};

// Función para formatear la duración de la canción
const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Función para añadir una canción a la playlist utilizando el store de favoritos
const addSongToPlaylist = (song) => {
  favoritesStore.addSong(song);
  console.log(`${song.title} añadida a la playlist`);
};
</script>

<style scoped>
.song-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.song-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px; /* Aumentar el padding para tarjetas más grandes */
  width: 350px; /* Aumentar el ancho de las tarjetas */
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.song-card:hover {
  transform: scale(1.05);
}

.album-cover {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.song-details {
  text-align: center;
}

.song-details p {
  margin: 5px 0;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0056b3;
}

audio {
  margin-top: 10px;
  width: 100%;
}
</style>
