import adapter from '@sveltejs/adapter-static'
import autoImport from 'sveltekit-autoimport'
import WindiCSS from 'vite-plugin-windicss'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			plugins: [
				autoImport({ 
					components: ['./src/elements'],
					// frequently used modules
					module: {
						svelte: ['onMount', 'createEventDispatcher'],
						"$app/navigation": ['goto'],
					},
				}),
				WindiCSS(),
			]
		}
	}
};

export default config;
