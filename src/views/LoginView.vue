<template>
    <div class="container mt-5">
      <div class="card mx-auto p-4 shadow" style="max-width: 400px;">
        <h2 class="text-center text-primary">{{ isRegister ? "Registro" : "Iniciar Sesión" }}</h2>
  
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">Usuario</label>
            <input v-model="userData.username" type="text" class="form-control" required />
          </div>
  
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input v-model="userData.password" type="password" class="form-control" required />
          </div>
  
          <div v-if="isRegister" class="mb-3">
            <label class="form-label">Selecciona un Avatar</label>
            <div class="d-flex justify-content-center gap-3">
              <img
                v-for="avatar in avatars"
                :key="avatar"
                :src="avatar"
                class="rounded-circle border avatar-option"
                :class="{ 'border-primary': userData.avatar === avatar }"
                @click="userData.avatar = avatar"
              />
            </div>
          </div>
  
          <button class="btn btn-primary w-100 mt-3" type="submit">
            {{ isRegister ? "Registrarse" : "Iniciar Sesión" }}
          </button>
        </form>
  
        <p class="text-center mt-3">
          <a href="#" @click.prevent="toggleMode">{{ isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate" }}</a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const isRegister = ref(false);
  const userData = ref({ username: "", password: "", avatar: "" });
  
  const avatars = [
    "https://i.pravatar.cc/100?img=1",
    "https://i.pravatar.cc/100?img=2",
    "https://i.pravatar.cc/100?img=3"
  ];
  
  const handleSubmit = () => {
    if (isRegister.value) {
      localStorage.setItem("user", JSON.stringify(userData.value));
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.username === userData.value.username && storedUser.password === userData.value.password) {
        alert("Inicio de sesión exitoso");
      } else {
        alert("Usuario o contraseña incorrectos");
        return;
      }
    }
    router.push("/");
  };
  
  const toggleMode = () => {
    isRegister.value = !isRegister.value;
  };
  </script>
  
  <style scoped>
  .avatar-option {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
  </style>
  