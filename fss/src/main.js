import { createApp } from 'vue/dist/vue.esm-bundler';
import SearchForm from '@/components/search-form/SearchForm';
import SearchResult from '@/components/search-result/SearchResult';
import '!style-loader!css-loader!sass-loader!@/assets/scss/fss-bootstrap.scss';
import '!style-loader!css-loader!sass-loader!@/assets/scss/fss-style.scss';
import '!style-loader!css-loader!sass-loader!@/assets/scss/fss.scss';

window.addEventListener('load', () => {
  console.log("[FSS] Initialize fess-site-search...");
  const app = createApp({
    components: {
      'fess-search-form': SearchForm,
      'fess-search-result': SearchResult,
    }
  });
  app.mount('.fess-site-search');
});
