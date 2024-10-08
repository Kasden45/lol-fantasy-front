import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import axios from "axios";
import { func_global} from './global-func.js';
import store from '@/store';
import VueAxios from "vue-axios";
import App from "./App.vue";
import router from "./router"; // Import your Vue Router instance if used

// Create a Vue app instance
const app = createApp(App);

app.config.globalProperties.apiURL = 'https://worlds-fantasy-5b89dfe65b80.herokuapp.com/'
// app.config.globalProperties.apiURL = 'https://localhost:7061/'
app.config.globalProperties.currentTournament = '112966669920590211'
app.config.globalProperties.worlds_2023 = '110852926142971547'
app.config.globalProperties.msi_2024 = '112099354464733424'
app.config.globalProperties.worlds_2024 = '112966669920590211'

app.config.globalProperties.tournaments = {
    '110852926142971547': 'Worlds 2023',
    '112099354464733424': 'MSI 2024',
    '112966669920590211': 'Worlds 2024'

}

app.config.globalProperties.$func_global = func_global

// Use Vue Router if you have it
app.use(router);
app.use(store);
app.use(VueAxios, axios);


// Mount the app to the DOM
app.mount("#app");