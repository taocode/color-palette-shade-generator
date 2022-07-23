import adapter from '@sveltejs/adapter-static'
import autoImport from 'sveltekit-autoimport'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			default: true
		},
	}
};

export default config;
