import HistoryMode from "@/enum/HistoryMode";
import SearchService from "@/service/SearchService";
import SearchEvent from "@/events/SearchEvent";
import FormEvent from "@/events/FormEvent";
import FrontHelper from "@/helper/FrontHelper";

const { registerHistory } = FrontHelper();


/**
 * SearchResultHelper.js
 * 
 * This module provides helper functions for search result.
 */
export default function () {
  /**
   * Execute search/
   * @param {Object} searchCond 
   * @param {HistoryMode} historyMode 
   * @returns 
   */
  const doSearch = (fessUrl, searchCondForSearch, historyMode, state) => {
    if (state.searching) {
      // Noop if already searching.
      console.log("Now searching...");
      return;
    }

    // Synchronize the form value with search query.
    FormEvent.emitUpdateFormValue(searchCondForSearch.q);

    // Send search condition to Google Analytics.
    _sendGA(searchCondForSearch);

    state.searching = true;

    // Search
    const searchService = new SearchService(fessUrl);
    searchService
      .search(searchCondForSearch, state)
      .then((res) => {
        // Update search condition by condition.
        state.searchCond = searchCondForSearch;

        // Scroll to top position.
        if (searchCondForSearch.addition.scrollTop) {
          const boxEle = document.querySelector("#search-result-box");
          const top = boxEle.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: top,
            behavior: "instant",
          });
          searchCondForSearch.addition.scrollTop = false;
        }

        // Set history.
        if (historyMode === HistoryMode.PUSH) {
          registerHistory(searchCondForSearch, false);
        } else if (historyMode === HistoryMode.REPLACE) {
          registerHistory(searchCondForSearch, true);
        }

        state.searching = false;
        state.show = true;
      })
      .catch((res) => {
        state.searching = false;
        console.log("Search error. " + res);
      });
  };

  /**
   * Determine if an automatic search is necessary. 
   */
  const isAutoSearchCase = (params) => {
    return params["fss.query"] !== undefined;
  };

  /**
   * Create search condition by url parameter.
   */
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

  // Send search condition to Google Analytics.
  const _sendGA = (searchCond) => {
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

  // Show version for debugging.
  const showVersion = (fessUrl) => {
    const searchService = new SearchService(fessUrl);
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
    doSearch,
    isAutoSearchCase,
    createSearchCondFromParameter,
    showVersion
  };
}
