<template>
    <div class="artist-page" v-if="artist">
      <img :src="artist.picture_big" alt="Imagen del artista" class="artist-image" />
      <div class="artist-details">
        <strong>{{ artist.name }}</strong>
        <p>Seguidores: {{ artist.nb_fan }}</p>
        <p>Álbumes: {{ artist.nb_album }}</p>
      </div>
  
      <h2>Álbumes más populares</h2>
      <div class="albums-container" v-if="albums.length > 0">
        <div v-for="album in albums.slice(0, 5)" :key="album.id" class="album-card">
          <img :src="album.cover_medium" alt="Portada del álbum" class="album-cover" />
          <p>{{ album.title }}</p>
        </div>
      </div>
      <p v-else>No hay álbumes para mostrar</p>
    </div>
    <p v-else>Cargando...</p>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const artist = ref(null);
  const albums = ref([]);
  
  const obtenerDatosDelArtista = async (artistId) => {
    try {
      // Obtener detalles del artista
      const artistResponse = await axios.get(`http://localhost:8080/https://api.deezer.com/artist/${artistId}`);
      artist.value = artistResponse.data;
  
      // Obtener álbumes del artista (limitar a los 5 primeros)
      const albumsResponse = await axios.get(`http://localhost:8080/https://api.deezer.com/artist/${artistId}/albums`);
      albums.value = albumsResponse.data.data.slice(0, 5);
    } catch (error) {
      console.error('Error al obtener los datos del artista:', error);
    }
  };
  
  onMounted(() => {
    const artistId = route.params.id;
    obtenerDatosDelArtista(artistId);
  });
  </script>
  
  <style scoped>
  .artist-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .artist-image {
    width: 200px;
    border-radius: 50%;
    margin-bottom: 20px;
  }
  
  .artist-details {
    text-align: center;
  }
  
  .artist-details strong {
    font-size: 1.5em;
    margin-bottom: 10px;
    display: block;
  }
  
  .artist-details p {
    margin: 5px 0;
  }
  
  h2 {
    font-size: 1.5em;
    margin-top: 30px;
  }
  
  .albums-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
  }
  
  .album-card {
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    width: 150px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .album-card:hover {
    transform: scale(1.05);
  }
  
  .album-cover {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  
  p {
    margin: 5px 0;
  }
  </style>
  