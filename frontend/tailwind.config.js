import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
	plugins: [animate],
	theme: {
		extend: {
			screens: {
				ss: "360px",
				xs: "480px",
			},
			container: {
				center: true,
				screens: {
					sm: "640px",
					md: "768px",
					lg: "1024px",
					xl: "1280px",
				},
			},
		
		},
	},
};