import { createRouter, createWebHistory } from "vue-router";
import Landing from "@/views/Landing.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Reviews from "@/views/Reviews.vue";
import Reports from "@/views/Reports.vue";
import Profile from "@/views/Profile.vue";

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     { path: "/", component: Landing },
//     { path: "/login", component: Login },
//     { path: "/register", component: Register },
//     { path: "/reviews", component: Reviews },
//   ],
// });

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: Landing },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    {
      path: "/reviews",
      component: Reviews,
      meta: { requiresAuth: true, roles: ["ADMINISTRATOR"] },
    },
    {
      path: "/reports",
      component: Reports,
      meta: { requiresAuth: true, roles: ["ADMINISTRATOR"] },
    },
    {
      path: "/profile",
      component: Profile,
      meta: { requiresAuth: true, roles: ["SELLER", "BUYER"] },
    },
  ],
});

export default router;
