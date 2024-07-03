import type { App } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { queryClient } from "@/services/queryClient";
import { pinia } from "@/stores/pinia";

export default (app: App) => {
	app.use(VueQueryPlugin, { queryClient });
	app.use(pinia);
};