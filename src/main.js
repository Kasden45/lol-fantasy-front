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
app.config.globalProperties.$func_global = func_global

// Use Vue Router if you have it
app.use(router);
app.use(store);
app.use(VueAxios, axios);


// Mount the app to the DOM
app.mount("#app");