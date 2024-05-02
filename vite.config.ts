import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills' // only for @vue-dapp/coinbase

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), nodePolyfills()],
	define: {
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // refer to https://stackoverflow.com/questions/77752897/feature-flag-vue-prod-hydration-mismatch-details-is-not-explicitly-defined
	},
})
