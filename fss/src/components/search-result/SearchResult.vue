<script>
import { defineComponent, reactive, onMounted, nextTick } from "vue";

import FrontHelper from "@/helper/FrontHelper";
import SearchResultHelper from "@/helper/SearchResultHelper";
import jsonConfig from '@/config/JsonConfig';

import HistoryMode from "@/enum/HistoryMode";
import SearchService from "@/service/SearchService";

import SearchEvent from "@/events/SearchEvent";
import FormEvent from "@/events/FormEvent";
import ResultHeader from "@/components/search-result/ResultHeader";
import ResultItem from "@/components/search-result/ResultItem";
import ResultPagination from "@/components/search-result/ResultPagination";

const { getUrlParameters, getHistoryState, registerHistory } = FrontHelper();
const { doSearch, isAutoSearchCase, createSearchCondFromParameter, showVersion } = SearchResultHelper();


/**
 * Component for search result.
 */
export default defineComponent({
  components: {
    "result-header": ResultHeader,
    "result-item": ResultItem,
    "result-pagination": ResultPagination,
  },
  props: {
    // Url of fess.
    fessUrl: {
      type: String,
      default: "http://localhost:8080/",
    },
    // Enable search order.
    enableOrder: {
      type: Boolean,
      default: jsonConfig.enableOrder(true),
    },
    // Enable all search order.
    enableAllOrders: {
      type: Boolean,
      default: jsonConfig.enableAllOrders(false),
    },
    // Enable filtering by label.
    enableLabel: {
      type: Boolean,
      default: jsonConfig.enableLabels(false),
    },
    // Enable show label by tab style.
    enableLabelTab: {
      type: Boolean,
      default: jsonConfig.enableLabelTabs(false),
    },
    // Enable thumbnail
    enableThumbnail: {
      type: Boolean,
      default: jsonConfig.enableThumbnail(true),
    },
    // Language for search.
    language: {
      type: String,
      default: "",
    },
    // Page size of search result..
    pageSize: {
      type: Number,
      default: 10,
    },
    // Link target.
    linkTarget: {
      type: String,
      default: "",
    },
    // Enable show related info.
    enableRelated: {
      type: Boolean,
      default: false,
    },
    // Enable show details.
    enableDetails: {
      type: Boolean,
      default: jsonConfig.enableDetails(true),
    },
  },

  setup(props, context) {
    // reactive data
    const state = reactive({
      show: false,
      searching: false,
      recordCount: -1,
      recordCountRelation: "EQUAL_TO",
      startRecordNumber: -1,
      endRecordNumber: -1,
      execTime: -1,
      q: "",
      queryId: "",
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
    });

    onMounted(() => {
      // Handle search event.
      SearchEvent.onBasicSearch((searchCond) => {
        search(searchCond);
      });

      // Handle popstate.
      window.addEventListener("popstate", (event) => {
        if (event.state !== null) {
          // Search by condition of popstate.
          searchInternal(event.state.searchCond, HistoryMode.NONE);
        }
      });
    });

    nextTick(() => {
      const historyState = getHistoryState();
      const urlParams = getUrlParameters();

      // Show version.
      if (urlParams["fss.version"] !== undefined) {
        showVersion(props.fessUrl);
      }

      // Auto search if necessary.
      if (historyState !== null) {
        searchInternal(historyState.searchCond, HistoryMode.REPLACE);
      } else if (isAutoSearchCase(urlParams)) {
        searchInternal(
          createSearchCondFromParameter(urlParams),
          HistoryMode.PUSH
        );
      }
    });

    // method definitions
    const search = (searchCond) => {
      searchInternal(searchCond, HistoryMode.PUSH);
    };

    const searchInternal = (searchCond, historyMode) => {
      // Copy search condition for custormization.
      const copiedSearchCond = SearchEvent.copySearchCond(searchCond);
      copiedSearchCond.pageSize = props.pageSize;
      doSearch(props.fessUrl, copiedSearchCond, historyMode, state);
    };

    return {
      state,
      search
    };
  },

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
