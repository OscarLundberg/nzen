import App from "./App.vue"
import { createApp } from "vue";
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap";
import 'prismjs/themes/prism.css'
import 'prismjs/themes/prism-tomorrow.css'

import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/brands.min.css'
// import './app.css'

const app = createApp(App);
app.mount(document.body)