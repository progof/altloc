import { defineConfig } from 'astro/config';
import { fileURLToPath, URL } from "node:url";
import vue from "@astrojs/vue";
import svg from "vite-svg-loader";
import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), tailwind(), icon()],
  server: { 
	port: 3000,
	proxy: {
		"/api": {
			target: "http://localhost:4000",
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\/api/, ""),
		},
	}, 
},
  vite: {
		build: { sourcemap: true },
		plugins: [svg({ svgo: false })],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
	},
});