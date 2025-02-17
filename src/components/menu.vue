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
      </div>
    </div>
  </nav>
</template>


<script setup>
import { RouterLink } from 'vue-router'
</script>


