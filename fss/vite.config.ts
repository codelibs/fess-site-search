import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

function readFileOrEmpty(envPath: string | undefined, label: string): string {
  if (!envPath) return '';
  try {
    const resolved = path.resolve(envPath);
    const content = fs.readFileSync(resolved, 'utf-8');
    console.log(`[FSS] Loaded ${label} from:`, resolved);
    return content;
  } catch (e) {
    console.warn(`[FSS] Failed to load ${label}:`, (e as Error).message);
    return '';
  }
}

// Load and embed JSON file if INPUT_JSON_PATH is specified
const jsonConfig: Record<string, unknown> = {};
const rawJson = readFileOrEmpty(process.env.INPUT_JSON_PATH, 'JSON config');
if (rawJson) {
  try {
    Object.assign(jsonConfig, JSON.parse(rawJson));
  } catch (e) {
    console.warn('[FSS] Failed to parse JSON config:', (e as Error).message);
  }
}

// Load and embed custom CSS file if INPUT_CSS_PATH is specified
const customCss = readFileOrEmpty(process.env.INPUT_CSS_PATH, 'custom CSS');

// Convert environment variables to define object (make values JSON-serializable)
const defineEnv = {
  // Replace process.env.NODE_ENV referenced by Vue.js
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
  '__FSS_JSON_CONFIG__': JSON.stringify(jsonConfig),
  '__FSS_CUSTOM_CSS__': JSON.stringify(customCss),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(), // Embed CSS in JS (for widget distribution)
  ],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['color-functions', 'global-builtin', 'import'],
      },
    },
  },
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
      entry: path.resolve(__dirname, 'src/main.ts'),
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
