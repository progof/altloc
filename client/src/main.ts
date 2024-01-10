import { createApp } from "vue";
import App, { router } from "./App.vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { queryClient } from "@/services/queryClient";

createApp(App).use(VueQueryPlugin, { queryClient }).use(router).mount("#app");
