<template>
  <div>
    <h1>Mi Playlist</h1>
    <div class="playlist" v-if="playlist.length > 0">
      <div v-for="song in playlist" :key="song.id" class="playlist-item">
        <img :src="song.album.cover" alt="Portada del álbum" class="album-cover" @click="playSong(song)" />
        <div class="song-details">
          <strong>{{ song.title }}</strong>
          <p>{{ song.artist.name }}</p>
          <p>{{ song.album.title }}</p>
        </div>
        <!-- Botón de papelera para eliminar la canción -->
        <button @click="removeSongFromPlaylist(song.id)" class="btn-delete">
          <i class="fas fa-trash"></i> <!-- Ícono de papelera -->
        </button>
      </div>
    </div>
    <p v-else>No hay canciones en la playlist</p>

    <!-- Reproductor Mejorado -->
    <div v-if="currentSong" class="music-player">
      <div class="player-left">
        <img :src="currentSong.album.cover" alt="Portada de la canción" class="player-cover" />
      </div>
      <div class="player-center">
        <div class="player-info">
          <strong>{{ currentSong.title }}</strong>
          <p>{{ currentSong.artist.name }}</p>
        </div>
        <input type="range" min="0" :max="audioDuration" step="0.1" v-model="audioTime" @input="seekAudio" class="progress-bar" />
        <div class="player-controls">
          <button @click="prevSong">⏮</button>
          <button @click="togglePlay">{{ isPlaying ? '⏸' : '▶' }}</button>
          <button @click="nextSong">⏭</button>
        </div>
      </div>
      <div class="player-right">
        <button class="player-fav" @click="toggleFavorite(currentSong)">
          <span :class="{ favorited: removeSongFromPlaylist(currentSong) }">🗑️</span>
          
        </button>
      </div>
      <!-- Audio (oculto, se controla por código) -->
      <audio ref="audio" :src="currentSong.preview" @timeupdate="updateTime" @ended="nextSong" autoplay></audio>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useFavoritesStore } from "../stores/favorito.js"; 

const favoritesStore = useFavoritesStore(); 
const playlist = computed(() => favoritesStore.playlist); 

const currentSong = ref(null);
const isPlaying = ref(false);
const audioTime = ref(0);
const audioDuration = ref(0);
const audio = ref(null);

const removeSongFromPlaylist = (songId) => {
  favoritesStore.removeSong(songId);
};

const playSong = (song) => {
  currentSong.value = song;
  isPlaying.value = true;
  setTimeout(() => {
    audio.value.play();
  }, 100);
};

const togglePlay = () => {
  if (audio.value.paused) {
    audio.value.play();
    isPlaying.value = true;
  } else {
    audio.value.pause();
    isPlaying.value = false;
  }
};

const nextSong = () => {
  const currentIndex = playlist.value.findIndex(song => song.id === currentSong.value.id);
  if (currentIndex < playlist.value.length - 1) {
    playSong(playlist.value[currentIndex + 1]);
  }
};

const prevSong = () => {
  const currentIndex = playlist.value.findIndex(song => song.id === currentSong.value.id);
  if (currentIndex > 0) {
    playSong(playlist.value[currentIndex - 1]);
  }
};

const updateTime = () => {
  audioTime.value = audio.value.currentTime;
  audioDuration.value = audio.value.duration;
};

const seekAudio = () => {
  audio.value.currentTime = audioTime.value;
};

const toggleFavorite = (song) => {
  if (isFavorite(song)) {
    favoritesStore.removeSong(song.id);
  } else {
    favoritesStore.addSong(song);
  }
};

const isFavorite = (song) => {
  return favoritesStore.playlist.some((favSong) => favSong.id === song.id);
};
</script>

<style scoped>
/* Estilos de la playlist */
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
  background: white;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.album-cover {
  width: 60px;
  height: auto;
  border-radius: 10px;
  margin-right: 20px;
  cursor: pointer; /* Hace que la imagen sea clickeable */
}

.song-details {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Botón de papelera */
.btn-delete {
  background-color: transparent;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
}

.btn-delete i {
  font-size: 20px; /* Tamaño del ícono de la papelera */
}

/* Estilos del reproductor */
.music-player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #333;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
}

.player-left {
  flex: 0.2;
}

.player-cover {
  width: 60px;
  height: 60px;
  border-radius: 5px;
}

.player-center {
  flex: 0.6;
  text-align: center;
}

.progress-bar {
  width: 100%;
  margin: 5px 0;
}

.player-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.player-controls button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.player-controls button:hover {
  transform: scale(1.2);
}

.player-right {
  flex: 0.2;
  text-align: right;
}

.player-fav {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;
}

.player-fav:hover {
  transform: scale(1.2);
}
</style>
