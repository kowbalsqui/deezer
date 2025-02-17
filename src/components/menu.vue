<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavbar" aria-controls="menuNavbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="menuNavbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/">🏠 Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/playlists">🎵 Playlists</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/search">🔍 Buscador</router-link>
          </li>
        </ul>

        <div v-if="user" class="d-flex align-items-center">
          <img :src="user.avatar" alt="Avatar" class="rounded-circle me-2" style="width: 40px; height: 40px;" />
          <span class="text-white me-3">{{ user.username }}</span>
          <button class="btn btn-outline-danger btn-sm" @click="logout">Salir</button>
        </div>

        <router-link v-else class="btn btn-outline-light" to="/login">Iniciar Sesión</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);

onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    user.value = storedUser;
  }
});

const logout = () => {
  localStorage.removeItem("user");
  user.value = null;
  window.location.reload();
};
</script>


