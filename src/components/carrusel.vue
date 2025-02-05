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
        class="carousel-indicator"
      ></li>
    </ol>

    <div class="carousel-inner">
      <div
        v-for="(song, index) in topSongs"
        :key="index"
        :class="['carousel-item', { active: index === 0 }]"
      >
        <img :src="song.album.cover_medium" class="d-block w-100 carousel-img" alt="Portada del álbum" />
        <div class="carousel-caption d-none d-md-block">
          <h5>{{ song.title }}</h5>
          <p>{{ song.artist.name }}</p>
        </div>
      </div>
    </div>

    <!-- Botones de control -->
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleAutoplaying"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleAutoplaying"
      data-bs-slide="next"
    >
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

<style scoped>
.carousel-inner img {
  height: 350px; /* Mantener la altura adecuada */
  width: 100%;   /* Asegurarse de que la imagen ocupa el 100% del ancho */
  object-fit: contain; /* Asegura que la imagen no se recorte */
  object-position: center; /* Centra la imagen */
  transition: transform 0.5s ease; /* Animación de la imagen */
}

.carousel-inner .carousel-item {
  position: relative;
  transition: opacity 0.5s ease-in-out;
}

.carousel-inner .carousel-item-next,
.carousel-inner .carousel-item-prev,
.carousel-inner .carousel-item.active {
  transition: transform 0.5s ease;
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.6); /* Fondo semitransparente más suave */
  padding: 10px 20px;  /* Ajusté el padding para mayor espacio */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transform: translateY(-50px);
  transition: transform 0.3s ease-in-out;
}

.carousel-caption h5 {
  font-size: 1.3rem;  /* Tamaño más pequeño para el título */
  font-weight: 500;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);  /* Sombra sutil para mejorar la legibilidad */
}

.carousel-caption p {
  font-size: 1rem;  /* Tamaño más pequeño para la descripción */
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);  /* Sombra para el texto */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.carousel-control-prev-icon:hover,
.carousel-control-next-icon:hover {
  background-color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
}

.carousel-control-prev,
.carousel-control-next {
  background-color: transparent;
  border: none;
}

.carousel-indicators li {
  background-color: #007bff;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.carousel-indicators li.active {
  background-color: #28a745;
}

.carousel-indicators li:hover {
  background-color: #0056b3;
}

.carousel-indicator {
  transition: background-color 0.3s ease;
}
</style>
