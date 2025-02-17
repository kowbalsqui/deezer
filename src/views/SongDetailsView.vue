<template>
  <div v-if="song" class="container text-center mt-4">
    <div class="card border-primary shadow-lg p-4 mx-auto" style="max-width: 600px;">
      <h1 class="display-5 text-primary">{{ song.title }}</h1>
      <img :src="song.album.cover_big" alt="Portada del álbum" class="img-fluid rounded shadow-lg mb-3" style="max-width: 300px;" />
      <p><strong>Álbum:</strong> {{ song.album.title }}</p>
      <p><strong>Duración:</strong> {{ formatDuration(song.duration) }}</p>
      <audio :src="song.preview" controls class="w-100 mt-2"></audio>

      <h2 class="mt-4 text-secondary">Artista</h2>
      <div v-if="artist" class="card border-light shadow-sm p-3 mt-3">
        <img :src="artist.picture_big" alt="Imagen del artista" class="img-fluid rounded-circle shadow-lg mb-2" style="width: 120px; height: 120px;" />
        <p><strong>Nombre:</strong> {{ artist.name }}</p>
        <button class="btn btn-outline-primary" @click="viewArtist(artist.id)">Ver Artista</button>
      </div>
    </div>
  </div>
  <p v-else class="text-center text-muted mt-4">Cargando...</p>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const song = ref(null);
const artist = ref(null);

const formatDuration = (duration) => {
  if (!duration) return 'N/A';
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const obtenerDetallesCancion = async (songId) => {
  try {
    const response = await axios.get(`http://localhost:8080/https://api.deezer.com/track/${songId}`);
    if (response.data) {
      song.value = response.data;
      artist.value = response.data.artist || null;
    }
  } catch (error) {
    console.error("Error obteniendo los detalles de la canción:", error);
  }
};

onMounted(() => {
  const songId = route.params.id;
  if (songId) {
    obtenerDetallesCancion(songId);
  }
});

const viewArtist = (artistId) => {
  if (artistId) {
    router.push({ name: 'Artist', params: { id: artistId } });
  }
};
</script>

