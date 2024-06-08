<!-- NavBar.vue -->
<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">Home</router-link>
      <div>
        <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="!auth">
          <li class="nav-item">
            <!-- <router-link to="/login" class="nav-link">Login</router-link> -->
            <v-btn text to="/login">Log in</v-btn>
          </li>
          <li class="nav-item">
            <!-- <router-link to="/register" class="nav-link">Register</router-link> -->
            <v-btn text class="register-button" to="/register">Register</v-btn>
          </li>
        </ul>
        <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="auth">
          <li class="nav-item">
            <v-btn text to="/login" @click="logout">Log out</v-btn>
            <!-- <a href="#" class="nav-link" @click="logout">Logout</a> -->
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

export default {
  name: "NavBar",
  setup() {
    const router = useRouter();
    const store = useStore();
    const auth = computed(() => store.state.authenticated);

    const logout = async () => {
      Cookies.remove('jwt');
      await store.dispatch('setAuth', false);
      router.push('/login');
    };

    return {
      auth,
      logout
    };
  }
};
</script>

<style scoped>
.register-button {
  color: #FFC107;
}
</style>