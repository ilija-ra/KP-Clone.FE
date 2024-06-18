<template>
  <v-app>
    <v-navigation-drawer v-model="isSideMenuShown" app>
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Landing" @click="navigateTo('')"></v-list-item>
        <v-list-item v-if="role === 'ADMINISTRATOR'" prepend-icon="mdi-view-dashboard" title="Reviews" @click="navigateTo('reviews')"></v-list-item>
        <v-list-item v-if="role === 'ADMINISTRATOR'" prepend-icon="mdi-view-dashboard" title="Reports" @click="navigateTo('reports')"></v-list-item>
        <v-list-item v-if="role === 'SELLER' || role === 'BUYER'" prepend-icon="mdi-view-dashboard" title="Profile" @click="navigateTo('profile')"></v-list-item>
        <v-list-item v-if="role === 'SELLER' || role === 'BUYER' || role === 'ADMINISTRATOR'" prepend-icon="mdi-view-dashboard" title="Other users" @click="navigateTo('users')"></v-list-item>
        <v-list-item v-if="role === 'SELLER' || role === 'BUYER'" prepend-icon="mdi-view-dashboard" title="My products" @click="navigateTo('my-products')"></v-list-item>
        <v-list-item v-if="role === 'SELLER' || role === 'BUYER'" prepend-icon="mdi-view-dashboard" title="My reviews" @click="navigateTo('my-reviews')"></v-list-item>
        <v-list-item v-if="role === 'SELLER' || role === 'BUYER'" prepend-icon="mdi-view-dashboard" title="Reviews about me" @click="navigateTo('reviews-about-me')"></v-list-item>
        <v-list-item v-if="role === 'SELLER' || role === 'BUYER'" prepend-icon="mdi-view-dashboard" title="Report" @click="navigateTo('create-report')"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#3F51B5" dark>
      <v-app-bar-nav-icon @click="toggleSideMenu"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" class="navbar-brand">Web-shop</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div v-if="!auth">
        <v-btn text to="/login">Log in</v-btn>
        <v-btn text to="/register">Register</v-btn>
      </div>

      <div v-else class="d-flex align-center">
        <v-avatar color="#FF4786">{{ initials }}</v-avatar>
        <v-btn>Hello, {{ fullName }}!</v-btn>
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
    const role = computed(() => store.state.role);
    const fullName = computed(() => store.state.fullName);
    const initials = computed(() => store.state.initials);
    const isSideMenuShown = ref(false);

    const toggleSideMenu = () => {
      isSideMenuShown.value = !isSideMenuShown.value;
    };

    const navigateTo = (route: string) => {
      isSideMenuShown.value = false;
      router.push(`/${route}`);
    };

    const logout = async () => {
      isSideMenuShown.value = false;
      await store.dispatch('setAuth', false);
      await store.dispatch('setRole', null);
      await store.dispatch('setUserId', null);
      await store.dispatch('setFullName', null);
      await store.dispatch('setInitials', null);
      router.push('/login');
    };

    return {
      auth,
      role,
      fullName,
      initials,
      isSideMenuShown,
      toggleSideMenu,
      navigateTo,
      logout,
    };
  },
});
</script>


<style>
.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
}

.d-flex.align-center {
  display: flex;
  align-items: center;
}
</style>
