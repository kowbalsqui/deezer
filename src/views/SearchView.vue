<template>
  <div class="search-view">
    <h1>Búsqueda de canciones en Deezer</h1>
    <SearchBar @results="handleResults" />

    <!-- Tarjetas de canciones -->
    <div class="song-cards" v-if="songs.length > 0">
      <div v-for="song in songs" :key="song.id" class="song-card">
        <!-- Imagen de fondo de la tarjeta con el corazón en la esquina superior derecha -->
        <div class="card-bg" :style="{ backgroundImage: `url(${song.album.cover_medium})` }" @click="playSong(song)">
          <button class="heart-icon" @click.stop="toggleFavorite(song)">
            <span :class="{ favorited: isFavorite(song) }">❤️</span>
          </button>
        </div>
        <!-- Información de la canción -->
        <div class="card-info">
          <strong>{{ song.title }}</strong>
          <p>{{ song.artist.name }}</p>
        </div>
      </div>
    </div>
    <p v-else class="no-results">No hay resultados para mostrar</p>

    <!-- Reproductor de música en la parte inferior -->
    <div v-if="currentSong" class="music-player">
      <div class="player-left">
        <img :src="currentSong.album.cover_medium" alt="Portada de la canción" class="player-cover" />
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
          <span :class="{ favorited: isFavorite(currentSong) }">❤️</span>
        </button>
      </div>
      <!-- Audio (oculto, se controla por código) -->
      <audio ref="audio" :src="currentSong.preview" @timeupdate="updateTime" @ended="nextSong" autoplay></audio>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import SearchBar from "../components/SearchBar.vue";
import { useFavoritesStore } from "../stores/favorito.js";

const songs = ref([]);
const currentSong = ref(null);
const isPlaying = ref(false);
const audioTime = ref(0);
const audioDuration = ref(0);
const audio = ref(null);

const favoritesStore = useFavoritesStore();
const router = useRouter();

const handleResults = (data) => {
  songs.value = data;
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
  const currentIndex = songs.value.findIndex((s) => s.id === currentSong.value.id);
  if (currentIndex < songs.value.length - 1) {
    playSong(songs.value[currentIndex + 1]);
  }
};

const prevSong = () => {
  const currentIndex = songs.value.findIndex((s) => s.id === currentSong.value.id);
  if (currentIndex > 0) {
    playSong(songs.value[currentIndex - 1]);
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
/* Contenedor principal */
.search-view {
  padding: 20px;
  text-align: center;
}

/* Estilos de las tarjetas */
.song-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.song-card {
  width: 200px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  cursor: pointer;
}

.card-bg {
  width: 100%;
  height: 150px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.heart-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.heart-icon:hover {
  transform: scale(1.2);
}

.favorited {
  color: red;
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
