<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue';
const title = ref('Default');
const isSideMenuShown = ref(false);
const currentYear = new Date().getFullYear();
function toggleSideMenu() {
    isSideMenuShown.value = !isSideMenuShown.value;
}
</script>

<template>
  <v-app>
      <v-app-bar :elevation="10">
          <template v-slot:prepend>
              <v-app-bar-nav-icon @click="toggleSideMenu"></v-app-bar-nav-icon>
          </template>

          <!-- <v-app-bar-title></v-app-bar-title> -->
          <v-btn text to="/">Web-shop</v-btn>

          <v-spacer></v-spacer>

          <v-btn text to="/login">Login</v-btn>
          <v-btn text to="/register" class="register-button">Register</v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="isSideMenuShown" :width="240">
          <v-list-item prepend-icon="mdi-view-dashboard" title="Products" value="products" style="margin-top: 10px;"></v-list-item>
          <v-list-item prepend-icon="mdi-forum" title="Categories" value="categories"></v-list-item>
          <v-list-item prepend-icon="mdi-forum" title="Users" value="users"></v-list-item>
      </v-navigation-drawer>

      <RouterView/>

      <v-footer class="footer">© {{ currentYear }} Web-shop project. All rights reserved.</v-footer>
  </v-app>
</template>

<style scoped>
.register-button {
  color: #FFC107;
}

.footer {
  height: 50px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  /* background-color: #fff; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* border-top: 1px solid #e0e0e0; */
}
</style>

<!-- <template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style> -->
