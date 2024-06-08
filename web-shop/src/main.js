// import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify"; // Import Vuetify configuration

const app = createApp(App);

app.use(vuetify);
app.use(router);

app.mount("#app");
