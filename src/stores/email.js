import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '', // Estado inicial
  }),
  getters: {
    // Ejemplo de un getter para obtener el dominio del email
    emailDomain: (state) => state.email.split('@')[1] || '',
  },
  actions: {
    // Acción para actualizar el email
    setEmail(newEmail) {
      this.email = newEmail;
    },
    // Acción para limpiar el email
    clearEmail() {
      this.email = '';
    },
  },
});

export const useCounterStore = defineStore('counter', {
  state: () => ({
    playList: [],
  }),
  getters: {
    playListTotal: (state) => state.playList.length
  },
  actions: {
    setAddSong(newSong) {
      id = newSong.id;
      name = newSong.name;
      this.playList.push(id, name);
    }
  }
})
