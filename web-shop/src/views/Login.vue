<!-- Login.vue -->
<template>
  <form @submit.prevent="submit">
    <h1 class="h3 mb-3 fw-normal">Please log in!</h1>
    <input v-model="data.username" type="text" class="form-control" placeholder="Username" required>
    <input v-model="data.password" type="password" class="form-control" placeholder="Password" required>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Log in</button>
  </form>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import { useStore } from "vuex";

export default {
  name: "Login",
  setup() {
    const data = reactive({
      username: '',
      password: ''
    });
    const router = useRouter();
    const store = useStore();

    const submit = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', data, { withCredentials: true });
        document.cookie = `jwt=${response.data.token}`;
        await store.dispatch('setAuth', true);
        router.push('/');
      } catch (error) {
        console.error('Error:', error.response?.data?.errors || error.message);
      }
    };

    return {
      data,
      submit
    };
  }
};
</script>
