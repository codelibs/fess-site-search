/**
 * SearchResultHelper.ts
 *
 * This module provides helper functions for search result operations,
 * including executing searches, handling URL parameters, and managing Google Analytics.
 */

import HistoryMode from '@/enum/HistoryMode';
import SearchService from '@/service/SearchService';
import SearchEvent from '@/events/SearchEvent';
import FormEvent from '@/events/FormEvent';
import FrontHelper from '@/helper/FrontHelper';
import type { SearchCondition, SearchState } from '@/types/search.types';
import type { UrlParameters } from '@/helper/FrontHelper';

const { registerHistory } = FrontHelper();

/**
 * Search result helper functions interface
 */
export interface SearchResultHelperFunctions {
  doSearch: (
    fessUrl: string,
    searchCondForSearch: SearchCondition,
    historyMode: HistoryMode,
    state: SearchState
  ) => void;
  isAutoSearchCase: (params: UrlParameters) => boolean;
  createSearchCondFromParameter: (params: UrlParameters) => SearchCondition;
  showVersion: (fessUrl: string) => void;
}

/**
 * Factory function that creates search result helper utilities
 * @returns Object containing search result helper functions
 */
export default function (): SearchResultHelperFunctions {
  /**
   * Execute search with the given condition and update state
   * @param fessUrl - Fess server URL
   * @param searchCondForSearch - Search condition to execute
   * @param historyMode - How to manage browser history
   * @param state - Search state object to update
   */
  const doSearch = (
    fessUrl: string,
    searchCondForSearch: SearchCondition,
    historyMode: HistoryMode,
    state: SearchState
  ): void => {
    if (state.searching) {
      // Noop if already searching.
      console.log('Now searching...');
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
      .then(() => {
        // Update search condition by condition.
        state.searchCond = searchCondForSearch;

        // Scroll to top position.
        if (searchCondForSearch.addition?.scrollTop) {
          const boxEle = document.querySelector('#search-result-box');
          if (boxEle) {
            const top = boxEle.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
              top: top,
              behavior: 'instant' as ScrollBehavior,
            });
            searchCondForSearch.addition.scrollTop = false;
          }
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
      .catch(() => {
        state.searching = false;
        console.log('Search error.');
      });
  };

  /**
   * Determine if an automatic search is necessary based on URL parameters
   * @param params - URL parameters
   * @returns True if automatic search should be triggered
   */
  const isAutoSearchCase = (params: UrlParameters): boolean => {
    return params['fss.query'] !== undefined;
  };

  /**
   * Create search condition object from URL parameters
   * @param params - URL parameters
   * @returns SearchCondition object
   */
  const createSearchCondFromParameter = (params: UrlParameters): SearchCondition => {
    const searchCond = SearchEvent.getInitialSearchCond();
    if (params['fss.query'] !== undefined && params['fss.query'][0]) {
      searchCond.q = params['fss.query'][0];
    }
    if (params['fss.label'] !== undefined && params['fss.label'][0]) {
      searchCond.label = params['fss.label'][0];
    }
    if (params['fss.sort'] !== undefined && params['fss.sort'][0]) {
      searchCond.sort = params['fss.sort'][0];
    }
    return searchCond;
  };

  /**
   * Send search condition to Google Analytics (if available)
   * @param searchCond - Search condition to track
   */
  const _sendGA = (searchCond: SearchCondition): void => {
    // Check if Google Analytics is available
    if (typeof window !== 'undefined' && typeof ga !== 'undefined') {
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
      // eslint-disable-next-line no-undef
      ga('send', 'pageview', u);
    }
  };

  /**
   * Show FSS and Fess version for debugging purposes
   * @param fessUrl - Fess server URL
   */
  const showVersion = (fessUrl: string): void => {
    const searchService = new SearchService(fessUrl);
    searchService
      .getFessVersion()
      .then((fessVersion) => {
        // Using dynamic import for package.json
        import('@/../package.json').then((pkg) => {
          console.log('fss:' + pkg.version + ' fess:' + fessVersion);
        });
      })
      .catch((e) => {
        import('@/../package.json').then((pkg) => {
          console.log('fss:' + pkg.version);
          console.error('Failed to get fess version.');
          console.error(e);
        });
      });
  };

  return {
    doSearch,
    isAutoSearchCase,
    createSearchCondFromParameter,
    showVersion,
  };
}
