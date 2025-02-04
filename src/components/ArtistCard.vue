<template>
    <div class="artist-card">
      <img :src="artist.picture_medium" alt="Imagen del artista" class="artist-image" />
      <div class="artist-details">
        <strong>{{ artist.name }}</strong>
        <p>Seguidores: {{ artist.nb_fan }}</p>
        <p>Álbumes: {{ artist.nb_album }}</p>
        <button @click="goToArtist(artist.id)">Ver más</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    artist: {
      type: Object,
      required: true,
    },
  });
  
  const router = useRouter();
  
  const goToArtist = (artistId) => {
    router.push({ name: 'Artist', params: { id: artistId } });
  };
  </script>
  
  <style scoped>
  .artist-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    width: 250px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .artist-card:hover {
    transform: scale(1.05);
  }
  
  .artist-image {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
  
  .artist-details {
    text-align: center;
  }
  
  .artist-details p {
    margin: 5px 0;
  }
  
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>