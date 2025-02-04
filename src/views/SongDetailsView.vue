<template>
    <div v-if="song">
      <h1>{{ song.title }}</h1>
      <img :src="song.album.cover_big" alt="Portada del álbum" class="album-cover" />
      <p>Álbum: {{ song.album.title }}</p>
      <p>Duración: {{ formatDuration(song.duration) }}</p>
      <audio :src="song.preview" controls></audio>
  
      <h2>Artista</h2>
      <div class="artist-info" v-if="artist">
        <img :src="artist.picture_big" alt="Imagen del artista" class="artist-image" />
        <p>Nombre: {{ artist.name }}</p>
        <p>Seguidores: {{ artist.nb_fan }}</p>
        <button @click="viewArtist(artist.id)">Ver Artista</button>
      </div>
    </div>
    <p v-else>Cargando...</p>
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
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const obtenerDetallesCancion = async (songId) => {
    try {
      const response = await axios.get(`http://localhost:8080/https://api.deezer.com/track/${songId}`);
      song.value = response.data;
      artist.value = response.data.artist;
    } catch (error) {
      console.error("Error obteniendo los detalles de la canción:", error);
    }
  };
  
  onMounted(() => {
    const songId = route.params.id;
    obtenerDetallesCancion(songId);
  });
  
  const viewArtist = (artistId) => {
    router.push({ name: 'Artist', params: { id: artistId } });
  };
  </script>
  
  <style scoped>
  .album-cover {
    width: 200px;
    border-radius: 10px;
  }
  
  .artist-image {
    width: 150px;
    border-radius: 10px;
  }
  </style>
  