<template>
  <v-app>
    <v-navigation-drawer v-model="isSideMenuShown" app>
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Products" @click="navigateTo('products')"></v-list-item>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Categories" @click="navigateTo('categories')"></v-list-item>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Users" @click="navigateTo('users')"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="toggleSideMenu"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" class="navbar-brand">Home</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div v-if="!auth">
        <v-btn text to="/login">Log in</v-btn>
        <v-btn text to="/register">Register</v-btn>
      </div>

      <div v-else>
        <v-btn text @click="logout">Log out</v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const auth = computed(() => store.state.authenticated);
    const isSideMenuShown = ref(false);

    const toggleSideMenu = () => {
      isSideMenuShown.value = !isSideMenuShown.value;
    };

    const navigateTo = (route: string) => {
      router.push(`/${route}`);
      isSideMenuShown.value = false; // Close drawer after navigation
    };

    const logout = () => {
      store.dispatch('setAuth', false);
      isSideMenuShown.value = false;
      router.push('/login');
    };

    return {
      auth,
      isSideMenuShown,
      toggleSideMenu,
      navigateTo,
      logout,
    };
  },
});
</script>

<style>
/* Add any custom styles if needed */
.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
}
</style>
