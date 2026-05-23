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

// Inject custom CSS generated at build time (embedded via __FSS_CUSTOM_CSS__ define)
if (__FSS_CUSTOM_CSS__) {
  const styleEl = document.createElement('style');
  styleEl.textContent = __FSS_CUSTOM_CSS__;
  document.head.appendChild(styleEl);
}

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', initFss);
