/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import { registerPlugins } from "@/plugins";
import App from "./App.vue";
import { createApp } from "vue";
import router from "@/router/index.ts";

const app = createApp(App);

registerPlugins(app);
app.use(router);
app.mount("#app");
