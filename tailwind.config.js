/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.{html,njk,md,js}",
	],
	theme: {
		extend: {
			fontFamily: {
				'sans': ['Open Sans', 'system-ui', 'sans-serif'],
			},
			colors: {
				'nervos-green': '#00cc9b',
				'background-dark': '#151515',
				'text-light': '#dddddd',
			},
		},
	},
};