/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import Default from "@/layouts/Default.vue";
import Landing from "@/views/Landing.vue";
import Login from "@/views/Login.vue";

const routes = [
  {
    path: "/",
    component: Default,
    children: [
      {
        path: "landing",
        component: Landing,
      },
      {
        path: "login",
        component: Login,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
