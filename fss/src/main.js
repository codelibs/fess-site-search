import { createApp } from 'vue/dist/vue.esm-bundler';
import SearchForm from '@/components/search-form/SearchForm.vue';
import SearchResult from '@/components/search-result/SearchResult.vue';
// Viteでは通常のimportでスタイルを読み込む（vite-plugin-css-injected-by-jsがJSに埋め込む）
import '@/assets/scss/fss-bootstrap.scss';
import '@/assets/scss/fss-style.scss';
import '@/assets/scss/fss.scss';

// カスタムCSSパスが指定されている場合は動的にインポート
const inputCssPath = import.meta.env.VITE_INPUT_CSS_PATH;
if (inputCssPath && inputCssPath !== 'undefined') {
  // Viteでは動的importを使用（ビルド時には解決されない可能性があるため条件付き）
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
