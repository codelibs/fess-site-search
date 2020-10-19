import Vue from 'vue';

import SearchForm from '@/components/search-form/SearchForm';
import SearchResult from '@/components/search-result/SearchResult';
import '!style-loader!css-loader!sass-loader!@/css/fss-bootstrap.scss';
import '!style-loader!css-loader!sass-loader!@/css/fss-style.scss';
import '!style-loader!css-loader!sass-loader!@/css/fss.scss';


new Vue({
  el: '.fess-site-search',
  components: {
    'fess-search-form': SearchForm,
    'fess-search-result': SearchResult,
  },
});
