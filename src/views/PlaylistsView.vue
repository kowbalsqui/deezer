<template>
  <div class="container mt-4">
    <h1 class="text-center text-primary">Mi Playlist</h1>

    <div v-if="playlist.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
      <div v-for="song in playlist" :key="song.id" class="col">
        <div class="card border-primary shadow-sm p-3">
          <img 
            :src="song.album.cover" 
            alt="Portada del álbum" 
            class="card-img-top rounded img-fluid"
            @click="playSong(song)" 
          />
          <div class="card-body text-center">
            <strong class="d-block">{{ song.title }}</strong>
            <p class="text-muted mb-1">{{ song.artist.name }}</p>
            <p class="text-muted">{{ song.album.title }}</p>
            <button @click="removeSongFromPlaylist(song.id)" class="btn btn-danger btn-sm">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-center text-muted">No hay canciones en la playlist</p>

    <!-- Reproductor Mejorado -->
    <div v-if="currentSong" class="card border-info shadow-lg mt-4">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <img 
            :src="currentSong.album.cover" 
            alt="Portada de la canción" 
            class="rounded-circle me-3" 
            style="width: 80px; height: 80px;"
          />
          <div>
            <strong>{{ currentSong.title }}</strong>
            <p class="text-muted mb-0">{{ currentSong.artist.name }}</p>
          </div>
        </div>

        <div class="d-flex flex-column align-items-center">
          <input type="range" min="0" :max="audioDuration" step="0.1" v-model="audioTime" @input="seekAudio" class="form-range w-100" />
          <div class="btn-group">
            <button @click="prevSong" class="btn btn-outline-secondary btn-sm">⏮</button>
            <button @click="togglePlay" class="btn btn-outline-primary btn-sm">
              {{ isPlaying ? '⏸' : '▶' }}
            </button>
            <button @click="nextSong" class="btn btn-outline-secondary btn-sm">⏭</button>
          </div>
        </div>

        <div>
          <button class="btn btn-outline-danger btn-sm" @click="toggleFavorite(currentSong)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
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