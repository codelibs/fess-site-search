<script>
import { defineComponent, reactive, onMounted, nextTick } from "vue";

import FrontHelper from "@/helper/FrontHelper";
import HistoryMode from "@/enum/HistoryMode";
import SearchService from "@/service/SearchService";

import SearchEvent from "@/events/SearchEvent";
import FormEvent from "@/events/FormEvent";
import ResultHeader from "@/components/search-result/ResultHeader";
import ResultItem from "@/components/search-result/ResultItem";
import ResultPagination from "@/components/search-result/ResultPagination";

const { getUrlParameters, getHistoryState, registerHistory } = FrontHelper();

export default defineComponent({
  components: {
    "result-header": ResultHeader,
    "result-item": ResultItem,
    "result-pagination": ResultPagination,
  },
  props: {
    fessUrl: {
      type: String,
      default: "http://localhost:8080/",
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
      default: "",
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    linkTarget: {
      type: String,
      default: "",
    },
    enableRelated: {
      type: Boolean,
      default: false,
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
      SearchEvent.onBasicSearch((searchCond) => {
        search(searchCond);
      });
      window.addEventListener("popstate", (event) => {
        if (event.state !== null) {
          searchInternal(event.state.searchCond, HistoryMode.NONE);
        }
      });
    });

    nextTick(() => {
      const historyState = getHistoryState();
      const urlParams = getUrlParameters();
      if (urlParams["fss.version"] !== undefined) {
        showVersion();
      }
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
      const copiedSearchCond = SearchEvent.copySearchCond(searchCond);
      copiedSearchCond.pageSize = props.pageSize;
      if (state.searching) {
        console.log("Now searching...");
        return;
      }

      FormEvent.emitUpdateFormValue(copiedSearchCond.q);
      if (typeof ga == "function") {
        sendGA(copiedSearchCond);
      }

      state.searching = true;
      const searchService = new SearchService(props.fessUrl);
      searchService
        .search(copiedSearchCond, state)
        .then((res) => {
          state.searchCond = copiedSearchCond;
          if (copiedSearchCond.addition.scrollTop) {
            const boxEle = document.querySelector("#search-result-box");
            const top = boxEle.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
              top: top,
              behavior: "instant",
            });
            copiedSearchCond.addition.scrollTop = false;
          }
          if (historyMode === HistoryMode.PUSH) {
            registerHistory(copiedSearchCond, false);
          } else if (historyMode === HistoryMode.REPLACE) {
            registerHistory(copiedSearchCond, true);
          }
          state.searching = false;
          state.show = true;
        })
        .catch((res) => {
          state.searching = false;
          console.log("Search error. " + res);
        });
    };

    const isAutoSearchCase = (params) => {
      return params["fss.query"] !== undefined;
    };

    const createSearchCondFromParameter = (params) => {
      const searchCond = SearchEvent.getInitialSearchCond();
      if (params["fss.query"] !== undefined) {
        searchCond.q = params["fss.query"][0];
      }
      if (params["fss.label"] !== undefined) {
        searchCond.label = params["fss.label"][0];
      }
      if (params["fss.sort"] !== undefined) {
        searchCond.sort = params["fss.sort"][0];
      }
      return searchCond;
    };

    const sendGA = (searchCond) => {
      if (typeof ga == "function") {
        let u =
          "/" +
          window.location.pathname +
          "?q=" +
          encodeURIComponent(searchCond.q);
        if (searchCond.page) {
          u = u + "&page=" + searchCond.page;
        }
        if (searchCond.pageSize) {
          u = u + "&pageSize=" + searchCond.pageSize;
        }
        if (searchCond.sort) {
          u = u + "&sort=" + searchCond.sort;
        }
        if (searchCond.label) {
          u = u + "&fields.label=" + searchCond.label;
        }
        ga("send", "pageview", u); // eslint-disable-line
      }
    };

    const showVersion = () => {
      const searchService = new SearchService(props.fessUrl);
      searchService
        .getFessVersion()
        .then((fessVersion) => {
          console.log(
            "fss:" +
              require("@/../package.json").version +
              " fess:" +
              fessVersion
          );
        })
        .catch((e) => {
          console.log("fss:" + require("@/../package.json").version);
          console.error("Failed to get fess version.");
          console.error(e);
        });
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
              :content-title="item.title"
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