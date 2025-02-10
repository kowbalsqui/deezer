<template>
  <div v-if="song" class="song-container">
    <h1 class="song-title">{{ song.title }}</h1>
    <img :src="song.album.cover_big" alt="Portada del álbum" class="album-cover" />
    <p><strong>Álbum:</strong> {{ song.album.title }}</p>
    <p><strong>Duración:</strong> {{ formatDuration(song.duration) }}</p>
    <audio :src="song.preview" controls class="audio-player"></audio>

    <h2 class="artist-section">Artista</h2>
    <div class="artist-info" v-if="artist">
      <img :src="artist.picture_big" alt="Imagen del artista" class="artist-image" />
      <p><strong>Nombre:</strong> {{ artist.name }}</p>
      <button class="btn btn-primary" @click="viewArtist(artist.id)">Ver Artista</button>
    </div>
  </div>
  <p v-else class="loading-text">Cargando...</p>
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

<style scoped>
.song-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.song-title {
  color: #007bff;
  font-size: 24px;
  font-weight: bold;
}

.album-cover {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  margin: 15px 0;
}

.audio-player {
  width: 100%;
  margin-top: 10px;
}

.artist-section {
  margin-top: 30px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.artist-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
}

.artist-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.loading-text {
  font-size: 18px;
  color: #666;
}
</style>
