import { createApp } from 'vue/dist/vue.esm-bundler';
import SearchForm from '@/components/search-form/SearchForm.vue';
import SearchResult from '@/components/search-result/SearchResult.vue';
// Import styles with Vite (embedded in JS by vite-plugin-css-injected-by-js)
import '@/assets/scss/main.scss';

/**
 * Initialize Fess Site Search widget.
 * Mounts Vue application with search components.
 */
const initFss = (): void => {
  console.log('[FSS] Initialize fess-site-search...');

  const app = createApp({
    components: {
      'fess-search-form': SearchForm,
      'fess-search-result': SearchResult,
    },
  });

  app.mount('.fess-site-search');
};

// Dynamically import if custom CSS path is specified
const inputCssPath: string = import.meta.env.VITE_INPUT_CSS_PATH as string;
if (inputCssPath && inputCssPath !== 'undefined') {
  // Note: @vite-ignore bypasses Vite's static analysis
  // The CSS file must exist at the specified path at runtime
  // If the path is invalid, the import will fail at runtime (caught by .catch())
  import(/* @vite-ignore */ inputCssPath).catch((err: Error) => {
    console.warn('[FSS] Failed to load custom CSS:', inputCssPath, err);
  });
}

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', initFss);
