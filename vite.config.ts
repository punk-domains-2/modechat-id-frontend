import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	define: {
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // refer to https://stackoverflow.com/questions/77752897/feature-flag-vue-prod-hydration-mismatch-details-is-not-explicitly-defined
	},
})
