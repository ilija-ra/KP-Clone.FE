<template>
  <v-app>
    <NavBar/>

    <!-- <main class="form-signin"> -->
      <!-- <v-main>
        <router-view/>
      </v-main> -->
     
    <!-- </main> -->

    <!-- <Footer/> -->
  </v-app>
  
</template>

<script>
  import NavBar from "@/components/NavBar.vue";
  import Footer from "@/components/Footer.vue";

  export default {
    components: {NavBar, Footer}
  }
</script>

<style>
  .form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
  }

  .form-signin .checkbox {
    font-weight: 400;
  }

  .form-signin .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
  }

  .form-signin .form-control:focus {
    z-index: 2;
  }

  .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>