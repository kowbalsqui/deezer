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
          <button @click="removeSongFromPlaylist(song.id)" class="btn-delete">Eliminar</button>
          <button class="btn-play" @click="playPreview(song)">Escuchar Preview</button>
        </div>
      </div>
    </div>
    <p v-else>No hay canciones en la playlist</p>

    <!-- Reproductor Mejorado -->
    <div v-if="currentSong" class="music-player">
      <img :src="currentSong.album.cover" alt="Portada del álbum" class="player-cover" />
      <div class="player-details">
        <strong>{{ currentSong.title }}</strong>
        <p>{{ currentSong.artist.name }}</p>
      </div>
      
      <!-- Controles -->
      <div class="player-controls">
        <button @click="prevSong">⏮</button>
        <button @click="togglePlay">{{ isPlaying ? '⏸' : '▶' }}</button>
        <button @click="nextSong">⏭</button>
      </div>

      <!-- Barra de Progreso -->
      <input type="range" v-model="progress" @input="seekAudio" class="progress-bar" />

      <!-- Control de Volumen -->
      <input type="range" min="0" max="1" step="0.1" v-model="volume" @input="setVolume" class="volume-bar" />

      <audio ref="audioPlayer" :src="currentSong.preview" @timeupdate="updateProgress" @ended="nextSong" controls></audio>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useFavoritesStore } from "../stores/favorito.js"; 

const favoritesStore = useFavoritesStore(); 
const playlist = computed(() => favoritesStore.playlist); 

const currentSong = ref(null);
const isPlaying = ref(false);
const progress = ref(0);
const volume = ref(1);
const audioPlayer = ref(null);

const removeSongFromPlaylist = (songId) => {
  favoritesStore.removeSong(songId);
};

const playPreview = (song) => {
  currentSong.value = song;
  isPlaying.value = true;
  setTimeout(() => {
    audioPlayer.value.play();
  }, 100);
};

const togglePlay = () => {
  if (audioPlayer.value.paused) {
    audioPlayer.value.play();
    isPlaying.value = true;
  } else {
    audioPlayer.value.pause();
    isPlaying.value = false;
  }
};

const updateProgress = () => {
  progress.value = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100;
};

const seekAudio = () => {
  audioPlayer.value.currentTime = (progress.value / 100) * audioPlayer.value.duration;
};

const setVolume = () => {
  audioPlayer.value.volume = volume.value;
};

const nextSong = () => {
  const currentIndex = playlist.value.findIndex(song => song.id === currentSong.value.id);
  if (currentIndex < playlist.value.length - 1) {
    playPreview(playlist.value[currentIndex + 1]);
  }
};

const prevSong = () => {
  const currentIndex = playlist.value.findIndex(song => song.id === currentSong.value.id);
  if (currentIndex > 0) {
    playPreview(playlist.value[currentIndex - 1]);
  }
};

watch(currentSong, (newSong) => {
  if (newSong) {
    setTimeout(() => {
      audioPlayer.value.play();
    }, 100);
  }
});
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
}

.song-details {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-play {
  background-color: #007bff;
}

.btn-play:hover {
  background-color: #0056b3;
}

/* Estilos del reproductor */
.music-player {
  position: fixed;
  bottom: 50px; /* Justo encima del footer */
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  background: #222; /* Fondo oscuro para que combine con el footer */
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

.player-cover {
  width: 50px;
  height: 50px;
  border-radius: 5px;
}

.player-details {
  flex: 1;
  text-align: left;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar, .volume-bar {
  width: 100px;
  background-color: #007bff;
}

.progress-bar::-webkit-slider-runnable-track {
  background: #007bff;
  height: 5px;
  border-radius: 10px;
}

.progress-bar::-webkit-slider-thumb {
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.volume-bar {
  width: 80px;
}
</style>
