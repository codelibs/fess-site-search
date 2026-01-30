import { createApp } from 'vue/dist/vue.esm-bundler';
import SearchForm from '@/components/search-form/SearchForm.vue';
import SearchResult from '@/components/search-result/SearchResult.vue';
// In Vite, load styles with normal import (vite-plugin-css-injected-by-js embeds them in JS)
import '@/assets/scss/fss-bootstrap.scss';
import '@/assets/scss/fss-style.scss';
import '@/assets/scss/fss.scss';

// Dynamically import if custom CSS path is specified
const inputCssPath = import.meta.env.VITE_INPUT_CSS_PATH;
if (inputCssPath && inputCssPath !== 'undefined') {
  // Use dynamic import in Vite (conditional because it may not be resolved at build time)
  import(/* @vite-ignore */ inputCssPath).catch((err) => {
    console.warn('[FSS] Failed to load custom CSS:', inputCssPath, err);
  });
}

const initFss = () => {
  console.log("[FSS] Initialize fess-site-search...");
  const app = createApp({
    components: {
      'fess-search-form': SearchForm,
      'fess-search-result': SearchResult,
    }
  });
  app.mount('.fess-site-search');
};

window.addEventListener('DOMContentLoaded', initFss);
