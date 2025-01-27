<template>
  <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
    <!-- Indicators -->
    <ol class="carousel-indicators">
      <li v-for="(song, index) in topSongs" :key="index" :class="{ active: index === 0 }" data-bs-target="#carouselExampleAutoplaying" :data-bs-slide-to="index"></li>
    </ol>

    <div class="carousel-inner">
      <div v-for="(song, index) in topSongs" :key="index" :class="['carousel-item', { active: index === 0 }]">
        <img :src="song.album.cover_medium" class="d-block w-100" alt="Portada del álbum" />
        <div class="carousel-caption d-none d-md-block">
          <h5>{{ song.title }}</h5>
          <p>{{ song.artist.name }}</p>
        </div>
      </div>
    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const topSongs = ref([]);

// Función para obtener las canciones más escuchadas
const fetchTopSongs = async () => {
  const url = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/chart`;
  const response = await fetch(url);
  const data = await response.json();
  topSongs.value = data.tracks.data.slice(0, 3); // Tomamos las 3 canciones más escuchadas
};

// Llamar a la función al montar el componente
onMounted(fetchTopSongs);
</script>

<style scoped>
.carousel-inner img {
  height: 300px; /* Reducir la altura de la imagen */
  object-fit: cover;
}
.carousel-caption {
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
}
.carousel-indicators li {
  background-color: #007bff;
}
</style>
