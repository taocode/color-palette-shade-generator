import autoImport from 'sveltekit-autoimport'
import WindiCSS from 'vite-plugin-windicss';

import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		WindiCSS(),
	]
};

export default config;
