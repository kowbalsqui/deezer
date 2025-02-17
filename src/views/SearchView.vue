<template>
  <div class="container text-center mt-4">
    <h1 class="display-5 text-primary">Búsqueda de canciones en Deezer</h1>
    <SearchBar @results="handleResults" />

    <!-- Tarjetas de canciones -->
    <div v-if="songs.length > 0" class="row row-cols-2 row-cols-md-4 g-3 mt-3">
      <div v-for="song in songs" :key="song.id" class="col">
        <div class="card shadow-sm border-info h-100 text-center position-relative">
          <div class="position-relative">
            <img 
              :src="song.album.cover_medium" 
              alt="Portada del álbum" 
              class="card-img-top img-fluid" 
              @click="playSong(song)" 
            />
            <button class="btn btn-outline-danger position-absolute top-0 end-0 m-2 p-1" @click.stop="toggleFavorite(song)">
              <span :class="{ 'text-danger': isFavorite(song) }">❤️</span>
            </button>
          </div>
          <div class="card-body">
            <strong>{{ song.title }}</strong>
            <p class="text-muted">{{ song.artist.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-center text-muted mt-3">No hay resultados para mostrar</p>

    <!-- Reproductor de música -->
    <div v-if="currentSong" class="bg-dark text-white fixed-bottom p-3 shadow-lg">
      <div class="d-flex align-items-center justify-content-between">
        <!-- Portada e información -->
        <div class="d-flex align-items-center">
          <img 
            :src="currentSong.album.cover_medium" 
            alt="Portada de la canción" 
            class="rounded-circle me-3" 
            style="width: 60px; height: 60px;"
          />
          <div>
            <strong>{{ currentSong.title }}</strong>
            <p class="text-muted mb-0">{{ currentSong.artist.name }}</p>
          </div>
        </div>

        <!-- Barra de progreso -->
        <div class="text-center w-50">
          <input type="range" min="0" :max="audioDuration" step="0.1" v-model="audioTime" @input="seekAudio" class="form-range w-100" />
          
          <!-- Controles del reproductor -->
          <div class="btn-group">
            <button @click="prevSong" class="btn btn-outline-secondary btn-sm">
              ⏮
            </button>
            <button @click="togglePlay" class="btn btn-primary btn-sm">
              {{ isPlaying ? '⏸' : '▶' }}
            </button>
            <button @click="nextSong" class="btn btn-outline-secondary btn-sm">
              ⏭
            </button>
          </div>
        </div>

        <!-- Botón de favorito/eliminar -->
        <button class="btn btn-outline-danger btn-sm" @click="toggleFavorite(currentSong)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
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


