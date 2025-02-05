<template>
  <div class="container">
    <!-- Carousel -->
    <carrusel />
    <br>
    <br>
    <!-- Buscador de Canciones -->
    <div class="search-bar">
      <input v-model="searchQuery" @keyup.enter="buscarCanciones" placeholder="Buscar canciones..." />
      <button @click="buscarCanciones">Buscar</button>
    </div>

    <!-- Resultados de la Búsqueda -->
    <div v-if="searchResults.length > 0" class="search-results">
      <h2>Resultados de la Búsqueda</h2>
      <div class="playlist">
        <div v-for="song in searchResults" :key="song.id" class="playlist-item">
          <img :src="song.album.cover" alt="Portada del álbum" class="album-cover" loading="lazy" />
          <div class="song-details">
            <strong>{{ song.title }}</strong>
            <p>{{ song.artist.name }}</p>
            <p>{{ song.album.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top 5 Álbumes Más Escuchados -->
    <h1>Top Álbumes Más Escuchados</h1>
    <div class="grid">
      <div v-for="album in topAlbums" :key="album.id" class="grid-item">
        <img :src="album.cover" alt="Portada del álbum" class="album-cover" loading="lazy" />
        <div class="album-details">
          <strong>{{ album.title }}</strong>
          <p>{{ album.artist.name }}</p>
        </div>
      </div>
    </div>

    <br>

    <!-- Top 5 Artistas Más Escuchados -->
    <h2>Top Artistas Más Escuchados</h2>
    <div class="grid">
      <div v-for="artist in topArtists" :key="artist.id" class="grid-item" @click="verArtista(artist.id)">
        <img :src="artist.picture" alt="Imagen del artista" class="artist-picture" loading="lazy" />
        <div class="artist-details">
          <strong>{{ artist.name }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import carrusel from '../components/carrusel.vue';
import { useFavoritesStore } from '../stores/favorito.js';

const searchQuery = ref('');
const topAlbums = ref([]);
const topArtists = ref([]);
const searchResults = ref([]);
const favoritesStore = useFavoritesStore();
const router = useRouter();

const buscarCanciones = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/https://api.deezer.com/search?q=${searchQuery.value}`, {
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      }
    });
    searchResults.value = response.data.data;
  } catch (error) {
    console.error('Error al buscar las canciones:', error);
    alert('Hubo un problema al buscar las canciones. Por favor, inténtalo de nuevo más tarde.');
  }
};

const fetchTopAlbumsAndArtists = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/https://api.deezer.com/chart`, {
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      }
    });
    topAlbums.value = response.data.albums.data.slice(0, 5);
    topArtists.value = response.data.artists.data.slice(0, 5);
  } catch (error) {
    console.error('Error al cargar los álbumes y artistas:', error);
    alert('Hubo un problema al cargar los álbumes y artistas. Por favor, inténtalo de nuevo más tarde.');
  }
};

const verArtista = (artistId) => {
  router.push({ name: 'Artist', params: { id: artistId } });
};

onMounted(fetchTopAlbumsAndArtists);
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1, h2 {
  color: #007bff;
  text-align: center;
  font-family: 'Arial', sans-serif;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 500px;
  font-size: 16px;
}

.search-bar button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  justify-content: center;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.grid-item:hover {
  transform: scale(1.05);
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
}

.album-cover {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
  transition: transform 0.2s;
}

.grid-item:hover .album-cover {
  transform: scale(1.05);
}

.artist-picture {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
  transition: transform 0.2s;
}

.grid-item:hover .artist-picture {
  transform: scale(1.05);
}

.album-details, .artist-details {
  text-align: center;
  font-family: 'Arial', sans-serif;
}

.album-details strong, .artist-details strong {
  display: block;
  margin-bottom: 5px;
  font-size: 18px;
  color: #333;
}

.artist-details strong {
  font-size: 16px;
}
</style>
