import './assets/main.css'

import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { VueQueryPlugin } from "@tanstack/vue-query";
import { queryClient } from "@/services/queryClient";
import { pinia } from "./stores/pinia"; 

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.use(pinia)


app.mount('#app')





