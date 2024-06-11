// import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify"; // Import Vuetify configuration
import { createStore } from "vuex";
import store from "@/store/index.js";
// import routeGuard from "@/guards/routeGuard";

const app = createApp(App);

app.use(store);
app.use(vuetify);
app.use(router);
// app.use(routeGuard);

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.authenticated;
  const userRole = store.state.role;

  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      // If not authenticated, redirect to the login page
      next("/login");
    } else {
      // If authenticated, check if the user has the required role
      if (to.meta.roles && !to.meta.roles.includes(userRole)) {
        // If the user does not have the required role, redirect to a 403 page or another appropriate route
        next("/403");
      } else {
        // If authenticated and has the required role, proceed to the route
        next();
      }
    }
  } else {
    // If the route does not require authentication, proceed to the route
    next();
  }
});

app.mount("#app");
