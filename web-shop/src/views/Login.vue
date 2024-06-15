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
import axiosInstance from '@/interceptors/axiosInterceptor.js'
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
        const token = response.data.token;
        document.cookie = `jwt=${token}`;

        const user = await fetchUser();

        await store.dispatch('setAuth', true);
        await store.dispatch('setRole', user.roles[0]);
        await store.dispatch('setUserId', user.id);
        router.push('/');
      } catch (error) {
        console.error('Error:', error.response?.data?.errors || error.message);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('users/get-current-user', { withCredentials: true });
        return response.data;
      } catch (error) {
        await store.dispatch('setAuth', false);
        await store.dispatch('setRole', null);
        await store.dispatch('setUserId', null);
        throw error;
      }
    };

    return {
      data,
      submit
    };
  }
};
</script>
