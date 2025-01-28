<template>
  <div>
    <h1>Mi Playlist</h1>
    <div class="playlist" v-if="playlist.length > 0">
      <div v-for="song in playlist" :key="song.id" class="playlist-item">
        <img :src="song.album.cover" alt="Portada del álbum" class="album-cover" />
        <div class="song-details">
          <strong>{{ song.title }}</strong>
          <p>{{ song.artist.name }}</p>
          <p>{{ song.album.title }}</p>
          <button @click="removeSongFromPlaylist(song.id)">Eliminar</button>
          <button class="play-button" @click="playPreview(song)">Escuchar Preview</button>
        </div>
      </div>
    </div>
    <p v-else>No hay canciones en la playlist</p>
    
    <div v-if="currentSong" class="music-player">
      <img :src="currentSong.album.cover" alt="Portada del álbum" class="player-cover" />
      <div class="player-details">
        <strong>{{ currentSong.title }}</strong>
        <p>{{ currentSong.artist.name }}</p>
      </div>
      <audio :src="currentSong.preview" controls></audio>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useFavoritesStore } from "../stores/favorito.js"; // Importa el store de favoritos

const favoritesStore = useFavoritesStore(); // Instancia del store de favoritos

const playlist = computed(() => favoritesStore.playlist); // Computed property para la playlist

const currentSong = ref(null); // Ref para la canción actual

// Función para eliminar una canción de la playlist
const removeSongFromPlaylist = (songId) => {
  favoritesStore.removeSong(songId);
  console.log(`Canción con ID ${songId} eliminada de la playlist`);
};

// Función para reproducir la vista previa de la canción
const playPreview = (song) => {
  currentSong.value = song;
};
</script>

<style scoped>
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
  display: flex;
  align-items: center;
  gap: 10px;
}

button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #c82333;
}

.play-button {
  background-color: #007bff; /* Azul */
}

.play-button:hover {
  background-color: #0056b3; /* Azul más oscuro */
}

.music-player {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.player-cover {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}

.player-details {
  flex: 1;
  text-align: left;
}

audio {
  width: 100%;
  max-width: 600px;
}
</style>
