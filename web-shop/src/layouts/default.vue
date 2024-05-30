<template>
    <v-app>
      <v-app-bar :elevation="10">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="toggleSideMenu"></v-app-bar-nav-icon>
        </template>
  
        <v-btn to="/landing">Web-shop</v-btn>
  
        <v-spacer></v-spacer>
  
        <v-btn text to="/login">Login</v-btn>
        <v-btn text to="/register" class="register-button">Register</v-btn>
      </v-app-bar>
  
      <v-navigation-drawer v-model="isSideMenuShown" :width="240">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Products"
          value="products"
          style="margin-top: 10px;"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Categories" value="categories"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Users" value="users"></v-list-item>
      </v-navigation-drawer>
  
      <v-main class="main-content">
        <RouterView />
      </v-main>
  
      <v-footer class="footer">© {{ currentYear }} Web-shop project. All rights reserved.</v-footer>
    </v-app>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const isSideMenuShown = ref(false);
  const currentYear = new Date().getFullYear();
  
  function toggleSideMenu() {
    isSideMenuShown.value = !isSideMenuShown.value;
  }
  </script>
  
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
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    background-color: #e6d296;
    overflow: auto;
  }
  </style>
  