<!-- Landing.vue -->
<template>
  {{ message }}
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import axiosInstance from '@/interceptors/axiosInterceptor';
import { useStore } from "vuex";

export default {
  name: "Landing",
  setup() {
    const message = ref('You are not logged in!');
    const store = useStore();

    onMounted(async () => {
      try {
        const response = await axiosInstance.get('users/get-current-user', { withCredentials: true });
        message.value = `Hi! ${response.data.firstName}`;
        await store.dispatch('setAuth', true);
      } catch (error) {
        await store.dispatch('setAuth', false);
      }
    });

    return {
      message
    };
  }
};
</script>
