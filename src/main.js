import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import axios from "axios";
import { func_global } from "./global-func.js";
import store from "@/store";
import VueAxios from "vue-axios";
import App from "./App.vue";
import router from "./router"; // Import your Vue Router instance if used
import "@fortawesome/fontawesome-free/css/all.css";

// Create a Vue app instance
const app = createApp(App);

// app.config.globalProperties.apiURL =
("https://worlds-fantasy-5b89dfe65b80.herokuapp.com/");
// app.config.globalProperties.apiURL = "https://localhost:7061/";
app.config.globalProperties.currentTournament = "112966669920590211";
app.config.globalProperties.worlds_2023 = "110852926142971547";
app.config.globalProperties.msi_2024 = "112099354464733424";
app.config.globalProperties.worlds_2024 = "112966669920590211";
app.config.globalProperties.msi_2025 = "113470835034591734";
app.config.globalProperties.worlds_2025 = "113475452383887518";
app.config.globalProperties.lec_split_1_2026 = "115548424304940735";
app.config.globalProperties.lck_split_2_2026 = "115548128960088078";

app.config.globalProperties.tournaments = {
  "110852926142971547": "Worlds 2023",
  "112099354464733424": "MSI 2024",
  "112966669920590211": "Worlds 2024",
  "113470835034591734": "MSI 2025",
  "113475452383887518": "Worlds 2025",
  "115548424304940735": "LEC Split 1 2026",
  "115548128960088078": "LCK Split 2 2026",
};

app.config.globalProperties.tournaments_icons = {
  "110852926142971547": "WORLDS",
  "112099354464733424": "MSI",
  "112966669920590211": "WORLDS",
  "113470835034591734": "MSI",
  "113475452383887518": "WORLDS",
  "115548424304940735": "LEC",
  "115548128960088078": "LCK",
};

app.config.globalProperties.$func_global = func_global;

// Use Vue Router if you have it
app.use(router);
app.use(store);
app.use(VueAxios, axios);

// Mount the app to the DOM
app.mount("#app");
