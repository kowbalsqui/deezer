<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watchEffect, onMounted } from 'vue';
import axios from 'axios';
import { useMainStore } from '@/stores/busqueda';

const route = useRoute();
const router = useRouter();
const store = useMainStore();
const album = ref(null);
const tracks = ref([]);

const fetchAlbumDetails = async () => {
  if (!store.currentAlbum) {
    album.value = {
      id: route.params.id,
      title: route.query.title,
      cover: route.query.cover,
      artist: { name: route.query.artist }
    };
  } else {
    album.value = store.currentAlbum;
  }

  try {
    const response = await axios.get(`http://localhost:8080/https://api.deezer.com/album/${album.value.id}`);
    tracks.value = response.data.tracks.data.slice(0, 3);
  } catch (error) {
    console.error('Error al cargar el álbum:', error);
    alert('Hubo un problema al cargar los detalles del álbum.');
  }
};


const viewSongDetails = (track) => {
  router.push({ name: 'SongDetails', params: { id: track.id } });
};

onMounted(fetchAlbumDetails);
</script>

<template>
  <div v-if="album" class="album-details">
    <h1>{{ album.title }}</h1>
    <img :src="album.cover" alt="Portada del álbum" class="album-cover" />
    <p><strong>Artista:</strong> {{ album.artist.name }}</p>
    
    <div class="tracklist">
      <h2>Lista de Canciones</h2>
      <div class="track-grid">
        <div v-for="track in tracks" :key="track.id" class="track-item" @click="viewSongDetails(track)">
          <img :src="track.album.cover" alt="Portada del álbum" class="track-cover" />
          <p><strong>{{ track.title }}</strong></p>
          <p>Duración: {{ track.duration }}s</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.album-details {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  background-color: #f8c6c6;
  padding: 20px;
  border-radius: 10px;
}
.album-cover {
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  margin-bottom: 20px;
}
.tracklist {
  margin-top: 20px;
}
.track-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
}
.track-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.track-item:hover {
  background-color: #f0f0f0;
}
.track-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}
</style>