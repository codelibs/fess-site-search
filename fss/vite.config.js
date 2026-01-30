import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

// Load and embed JSON file if INPUT_JSON_PATH is specified
let jsonConfig = {};
if (process.env.INPUT_JSON_PATH) {
  try {
    const jsonPath = path.resolve(process.env.INPUT_JSON_PATH);
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    jsonConfig = JSON.parse(jsonContent);
    console.log('[FSS] Loaded JSON config from:', jsonPath);
  } catch (e) {
    console.warn('[FSS] Failed to load JSON config:', e.message);
  }
}

// Convert environment variables to define object (make values JSON-serializable)
const defineEnv = {
  // Replace process.env.NODE_ENV referenced by Vue.js
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
  'import.meta.env.VITE_INPUT_CSS_PATH': JSON.stringify(process.env.INPUT_CSS_PATH || ''),
  '__FSS_JSON_CONFIG__': JSON.stringify(jsonConfig),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(), // Embed CSS in JS (for widget distribution)
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // querystring polyfill (required for browser environment)
      querystring: 'querystring-es3',
    },
    // Auto-resolve extensions (Vue CLI compatible)
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  define: defineEnv,
  build: {
    // Output single file in library mode
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'FessSiteSearch', // Global variable name (IIFE format)
      fileName: () => process.env.OUTPUT_JS_FILENAME || 'fess-ss.js',
      formats: ['iife'], // Immediately Invoked Function Expression format (for widget)
    },
    rollupOptions: {
      // Bundle all dependencies into single file
      external: [],
      output: {
        // No globals setting needed (because external: [])
        globals: {},
      },
    },
    // Disable filename hashing
    cssCodeSplit: false,
    // Disable sourcemap for production build
    sourcemap: false,
  },
});
