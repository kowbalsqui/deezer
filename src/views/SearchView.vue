<template>
  <div>
    <h1>Búsqueda de canciones en Deezer</h1>
    <SearchBar @results="handleResults" />
    <div class="song-cards" v-if="songs.length > 0">
      <div v-for="song in songs" :key="song.id" class="song-card">
        <img :src="song.album.cover_medium" alt="Portada del álbum" class="album-cover" />
        <div class="song-details">
          <strong>{{ song.title }}</strong>
          <p>{{ song.artist.name }}</p>
          <p>{{ song.album.title }}</p>
          <p>{{ formatDuration(song.duration) }}</p>
          <audio :src="song.preview" controls></audio>
          <button @click="addSongToPlaylist(song)">Añadir canción</button>
          <button @click="viewSongDetails(song.id)">Ver Detalles</button>
        </div>
      </div>
    </div>
    <p v-else>No hay resultados para mostrar</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import SearchBar from "../components/SearchBar.vue";
import { useFavoritesStore } from "../stores/favorito.js";

const songs = ref([]);
const favoritesStore = useFavoritesStore();
const router = useRouter();

const handleResults = (data) => {
  songs.value = data;
};

const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const addSongToPlaylist = (song) => {
  favoritesStore.addSong(song);
  console.log(`${song.title} añadida a la playlist`);
};

// Nueva función para ver los detalles de la canción
const viewSongDetails = (songId) => {
  router.push({ name: 'SongDetails', params: { id: songId } });
};
</script>


<style scoped>
/* Estilos anteriores */
</style>