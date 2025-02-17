<template>
  <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
    <!-- Indicadores -->
    <ol class="carousel-indicators">
      <li
        v-for="(song, index) in topSongs"
        :key="index"
        :class="{ active: index === 0 }"
        data-bs-target="#carouselExampleAutoplaying"
        :data-bs-slide-to="index"
      ></li>
    </ol>

    <div class="carousel-inner">
      <div
        v-for="(song, index) in topSongs"
        :key="index"
        :class="['carousel-item', { active: index === 0 }]"
      >
        <img :src="song.album.cover_medium" class="d-block w-100 img-fluid" alt="Portada del álbum" style="height: 350px; object-fit: cover;" />
        <div class="carousel-caption bg-dark bg-opacity-50 p-2 rounded shadow">
          <h5>{{ song.title }}</h5>
          <p>{{ song.artist.name }}</p>
        </div>
      </div>
    </div>

    <!-- Botones de control -->
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
  const url = `http://localhost:8080/https://api.deezer.com/chart`;
  const response = await fetch(url);
  const data = await response.json();
  topSongs.value = data.tracks.data.slice(0, 3); // Tomamos las 3 canciones más escuchadas
};

// Llamar a la función al montar el componente
onMounted(fetchTopSongs);
</script>

