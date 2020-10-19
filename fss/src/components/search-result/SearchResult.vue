<script>
import SearchService from '@/service/SearchService';
import FrontHelper from '@/helper/FrontHelper';
import HistoryMode from '@/enum/HistoryMode';

import SearchEvent from '@/events/SearchEvent';
import FormEvent from '@/events/FormEvent';
import ResultHeader from '@/components/search-result/ResultHeader';
import ResultItem from '@/components/search-result/ResultItem';
import Pagination from '@/components/search-result/Pagination';

const frontHelper = new FrontHelper();

export default {
  components: {
    'result-header': ResultHeader,
    'result-item': ResultItem,
    'pagination': Pagination,
  },
  props: {
    fessUrl: {
      type: String,
      default: 'http://localhost:8080/',
    },
    enableOrder: {
      type: Boolean,
      default: true,
    },
    enableLabel: {
      type: Boolean,
      default: true,
    },
    enableLabelTab: {
      type: Boolean,
      default: false,
    },
    enableThumbnail: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: '',
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    linkTarget: {
      type: String,
      default: '',
    },
    enableRelated: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      show: false,
      searching: false,
      recordCount: -1,
      recordCountRelation: 'EQUAL_TO',
      startRecordNumber: -1,
      endRecordNumber: -1,
      execTime: -1,
      q: '',
      queryId: '',
      items: [],
      relatedQueries: [],
      relatedContents: [],
      pageInfo: {
        pageNumbers: [],
        currentPageNumber: -1,
        prevPage: false,
        nextPage: false,
      },
      searchCond: {},
    };
  },
  mounted: function() {
    SearchEvent.handleBasicSearch(this.search);
    window.addEventListener(
      "popstate",
      event => {
        if (event.state !== null) {
          this.searchInternal(event.state.searchCond, HistoryMode.NONE);
        }
      }
    );
    this.$nextTick(() => {
      const historyState = frontHelper.getHistoryState();
      const urlParams = frontHelper.getUrlParameters();
      if (urlParams['fss.version'] !== undefined) {
        this._showVersion();
      }
      if (historyState !== null) {
        this.searchInternal(historyState.searchCond, HistoryMode.REPLACE);
      } else if (this._isAutoSearchCase(urlParams)) {
        this.searchInternal(this._createSearchCondFromParameter(urlParams), HistoryMode.PUSH);
      }
    });
  },
  methods: {
    search(searchCond) {
      this.searchInternal(searchCond, HistoryMode.PUSH);
    },

    searchInternal(searchCond, historyMode) {
      const copiedSearchCond = SearchEvent.copySearchCond(searchCond);
      copiedSearchCond.pageSize = this.pageSize;
      if (this.searching) {
        console.log('Now searching...');
        return;
      }

      FormEvent.updateFormValue(copiedSearchCond.q);
      if (typeof ga == 'function') {
        this._sendGA(copiedSearchCond);
      }

      this.searching = true;
      const searchService = new SearchService(this.fessUrl);
      searchService.search(copiedSearchCond, this).then((res) => {
        this.searchCond = copiedSearchCond;
        if (copiedSearchCond.addition.scrollTop) {
          const boxEle = document.querySelector('#search-result-box');
          const top = boxEle.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: top,
            behavior: "instant",
          });
          copiedSearchCond.addition.scrollTop = false;
        }
        if (historyMode === HistoryMode.PUSH) {
          frontHelper.registerHistory(copiedSearchCond, false);
        } else if (historyMode === HistoryMode.REPLACE) {
          frontHelper.registerHistory(copiedSearchCond, true);
        }
        this.searching = false;
        this.show = true;
      }).catch((res) => {
        this.searching = false;
        console.log('Search error. ' + res);
      });
    },
    
    _isAutoSearchCase(params) {
      return params['fss.query'] !== undefined;
    },

    _createSearchCondFromParameter(params) {
      const searchCond = SearchEvent.getInitialSearchCond();
      if (params['fss.query'] !== undefined) {
        searchCond.q = params['fss.query'][0];
      }
      if (params['fss.label'] !== undefined) {
        searchCond.label = params['fss.label'][0];
      }
      if (params['fss.sort'] !== undefined) {
        searchCond.sort = params['fss.sort'][0];
      }
      return searchCond;
    },

    _sendGA(searchCond) {
      if (typeof ga == 'function') {
        let u = '/' + window.location.pathname + '?q=' + encodeURIComponent(searchCond.q);
        if (searchCond.page) {
          u = u + '&page=' + searchCond.page;
        }
        if (searchCond.pageSize) {
          u = u + '&pageSize=' + searchCond.pageSize;
        }
        if (searchCond.sort) {
          u = u + '&sort=' + searchCond.sort;
        }
        if (searchCond.label) {
          u = u + '&fields.label=' + searchCond.label;
        }
        ga('send', 'pageview', u); // eslint-disable-line
      }
    },

    _showVersion() {
      const searchService = new SearchService(this.fessUrl);
      searchService.getFessVersion().then((fessVersion) => {
        console.log('fss:' + require('@/../package.json').version + ' fess:' + fessVersion);
      }).catch((e) => {
        console.log('fss:' + require('@/../package.json').version);
        console.error('Failed to get fess version.');
        console.error(e);
      });
    }
  },
};
</script>

<template>
  <div id="search-result-box" style="position:relative;">
    <template v-if="show">
      <result-header
        :fess-url="fessUrl"
        :record-count-relation="recordCountRelation"
        :record-count="recordCount"
        :start-record-number="startRecordNumber"
        :end-record-number="endRecordNumber"
        :exec-time="execTime"
        :current-search-cond="searchCond"
        :enable-order="enableOrder"
        :enable-label="enableLabel"
        :enable-label-tab="enableLabelTab"
        :language="language"
        :enable-related="enableRelated"
        :related-queries="relatedQueries"
        :related-contents="relatedContents"
      />
      <div id="result" class="">
        <ol class="list-unstyled">
          <li
            v-for="(item, index) in items"
            :key="item.doc_id"
          >
            <result-item
              :fess-url="fessUrl"
              :content-title="item.title"
              :doc-id="item.doc_id"
              :query-id="queryId"
              :url-link="item.url_link"
              :order="index"
              :content-description="item.content_description"
              :content-length="Number(item.content_length)"
              :site-path="item.site_path"
              :created="item.created"
              :last-modified="item.last_modified"
              :language="language"
              :enable-thumbnail="enableThumbnail"
              :link-target="linkTarget"
            />
          </li>
        </ol>
      </div>
      <div>
        <nav id="subfooter" class="mx-auto">
          <pagination
            v-if="recordCount > 0"
            :page-numbers="pageInfo.pageNumbers"
            :current-page-number="pageInfo.currentPageNumber"
            :prev-page="pageInfo.prevPage"
            :next-page="pageInfo.nextPage"
            :current-search-cond="searchCond"
            :language="language"
          />
        </nav>
      </div>
      <div v-if="searching" class="search-waiting" />
    </template>
  </div>
</template>