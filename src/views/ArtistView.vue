<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const artist = ref(null);
const songs = ref([]);

const fetchArtistDetails = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/https://api.deezer.com/artist/${route.params.id}`);
    artist.value = response.data;
    
    const songResponse = await axios.get(`http://localhost:8080/https://api.deezer.com/artist/${route.params.id}/top?limit=10`);
    songs.value = songResponse.data.data;
  } catch (error) {
    console.error('Error al cargar el artista:', error);
    alert('Hubo un problema al cargar los detalles del artista.');
  }
};

const viewSongDetails = (song) => {
  router.push({
    name: 'SongDetails',
    params: { id: song.id },
    query: { title: song.title, cover: song.album.cover, artist: artist.value.name }
  });
};

onMounted(fetchArtistDetails);
</script>

<template>
  <div v-if="artist" class="album-details">
    <h1>{{ artist.name }}</h1>
    <img :src="artist.picture_big" alt="Imagen del artista" class="album-cover" />

    <div class="tracklist">
      <h2>Canciones Populares</h2>
      <div class="track-grid">
        <div v-for="song in songs" :key="song.id" class="track-item" @click="viewSongDetails(song)">
          <img :src="song.album.cover" alt="Portada del álbum" class="track-cover" />
          <p><strong>{{ song.title }}</strong></p>
          <p>Duración: {{ song.duration }}s</p>
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
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}
.track-item:hover {
  background-color: #141111;
}
.track-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}
</style>
