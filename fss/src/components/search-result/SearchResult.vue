<script setup lang="ts">
import { reactive, onMounted, nextTick } from 'vue';
import FrontHelper from '@/helper/FrontHelper';
import SearchResultHelper from '@/helper/SearchResultHelper';
import jsonConfig from '@/config/JsonConfig';
import HistoryMode from '@/enum/HistoryMode';
import SearchEvent from '@/events/SearchEvent';
import ResultHeader from '@/components/search-result/ResultHeader.vue';
import ResultItem from '@/components/search-result/ResultItem.vue';
import ResultPagination from '@/components/search-result/ResultPagination.vue';
import type { SearchCondition, SearchState } from '@/types/search.types';

const { getUrlParameters, getHistoryState } = FrontHelper();
const { doSearch, isAutoSearchCase, createSearchCondFromParameter, showVersion } =
  SearchResultHelper();

/**
 * Component for search result.
 */

// Props interface
interface Props {
  fessUrl?: string;
  enableOrder?: boolean;
  enableAllOrders?: boolean;
  enableLabel?: boolean;
  enableLabelTab?: boolean;
  enableThumbnail?: boolean;
  language?: string;
  pageSize?: number;
  linkTarget?: string;
  enableRelated?: boolean;
  enableDetails?: boolean;
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  fessUrl: 'http://localhost:8080/',
  enableOrder: () => jsonConfig.enableOrder(true),
  enableAllOrders: () => jsonConfig.enableAllOrders(false),
  enableLabel: () => jsonConfig.enableLabels(false),
  enableLabelTab: () => jsonConfig.enableLabelTabs(false),
  enableThumbnail: () => jsonConfig.enableThumbnail(true),
  language: '',
  pageSize: 10,
  linkTarget: '',
  enableRelated: false,
  enableDetails: () => jsonConfig.enableDetails(true),
});

// Reactive state (implements SearchState interface)
const state = reactive<SearchState>({
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
});

/**
 * Execute search with PUSH history mode.
 */
const search = (searchCond: SearchCondition): void => {
  searchInternal(searchCond, HistoryMode.PUSH);
};

/**
 * Execute search with specified history mode.
 * Copies search condition and applies pageSize from props
 */
const searchInternal = (searchCond: SearchCondition, historyMode: HistoryMode): void => {
  // Copy search condition for customization
  const copiedSearchCond = SearchEvent.copySearchCond(searchCond);
  copiedSearchCond.pageSize = props.pageSize;
  doSearch(props.fessUrl, copiedSearchCond, historyMode, state);
};

// Component lifecycle
onMounted(() => {
  // Handle search event
  SearchEvent.onBasicSearch((searchCond: SearchCondition) => {
    search(searchCond);
  });

  // Handle popstate (browser back/forward)
  window.addEventListener('popstate', (event: PopStateEvent) => {
    if (event.state !== null && event.state.searchCond) {
      // Search by condition of popstate
      searchInternal(event.state.searchCond, HistoryMode.NONE);
    }
  });
});

nextTick(() => {
  const historyState = getHistoryState();
  const urlParams = getUrlParameters();

  // Show version if requested
  if (urlParams['fss.version'] !== undefined) {
    showVersion(props.fessUrl);
  }

  // Auto search if necessary
  if (historyState !== null) {
    searchInternal(historyState.searchCond, HistoryMode.REPLACE);
  } else if (isAutoSearchCase(urlParams)) {
    searchInternal(createSearchCondFromParameter(urlParams), HistoryMode.PUSH);
  }
});
</script>

<template>
  <div id="search-result-box" style="position: relative">
    <template v-if="state.show">
      <result-header
        :fess-url="fessUrl"
        :record-count-relation="state.recordCountRelation"
        :record-count="state.recordCount"
        :start-record-number="state.startRecordNumber"
        :end-record-number="state.endRecordNumber"
        :exec-time="state.execTime"
        :current-search-cond="state.searchCond"
        :enable-order="enableOrder"
        :enable-all-orders="enableAllOrders"
        :enable-label="enableLabel"
        :enable-label-tab="enableLabelTab"
        :language="language"
        :enable-related="enableRelated"
        :related-queries="state.relatedQueries"
        :related-contents="state.relatedContents"
      />
      <div id="result" class="">
        <ol class="list-unstyled">
          <li v-for="(item, index) in state.items" :key="item.doc_id">
            <result-item
              :fess-url="fessUrl"
              :content-title="item.content_title"
              :doc-id="item.doc_id"
              :query-id="state.queryId"
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
              :enable-details="enableDetails"
            />
          </li>
        </ol>
      </div>
      <div>
        <nav id="subfooter" class="mx-auto">
          <result-pagination
            v-if="state.recordCount > 0"
            :page-numbers="state.pageInfo.pageNumbers"
            :current-page-number="state.pageInfo.currentPageNumber"
            :prev-page="state.pageInfo.prevPage"
            :next-page="state.pageInfo.nextPage"
            :current-search-cond="state.searchCond"
            :language="language"
          />
        </nav>
      </div>
      <div v-if="state.searching" class="search-waiting" />
    </template>
  </div>
</template>
