/**
 * useSearchResultHelper.ts
 *
 * Vue 3 Composable for search result operations, including executing searches,
 * handling URL parameters, and managing Google Analytics.
 */

import HistoryMode from '@/enum/HistoryMode';
import SearchService from '@/service/SearchService';
import SearchEvent from '@/events/SearchEvent';
import FormEvent from '@/events/FormEvent';
import { useFrontHelper } from '@/composables/useFrontHelper';
import type { SearchCondition, SearchState } from '@/types/search.types';
import type { UrlParameters } from '@/composables/useFrontHelper';

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
 * Composable that provides search result helper utilities
 *
 * This composable handles search execution, URL parameter parsing,
 * and version display functionality. It uses useFrontHelper for
 * history management.
 *
 * @returns Object containing search result helper functions
 *
 * @example
 * ```typescript
 * import { useSearchResultHelper } from '@/composables/useSearchResultHelper';
 *
 * const { doSearch, isAutoSearchCase } = useSearchResultHelper();
 * doSearch(fessUrl, searchCond, HistoryMode.PUSH, state);
 * ```
 */
export function useSearchResultHelper(): SearchResultHelperFunctions {
  // Use FrontHelper composable for history management
  const { registerHistory } = useFrontHelper();

  /**
   * Execute search with the given condition and update state
   *
   * This function performs a search request, updates the application state,
   * manages browser history, and handles scrolling behavior.
   *
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
      // Prevent concurrent searches
      console.log('Now searching...');
      return;
    }

    // Synchronize the form value with search query.
    FormEvent.emitUpdateFormValue(searchCondForSearch.q);

    // Send search condition to Google Analytics.
    sendGA(searchCondForSearch);

    state.searching = true;

    // Search
    const searchService = new SearchService(fessUrl);
    searchService
      .search(searchCondForSearch, state)
      .then(() => {
        // Update search condition by condition.
        state.searchCond = searchCondForSearch;

        // Scroll to top position if requested.
        if (searchCondForSearch.addition?.scrollTop) {
          scrollToSearchResults();
          searchCondForSearch.addition.scrollTop = false;
        }

        // Set history based on mode.
        if (historyMode === HistoryMode.PUSH) {
          registerHistory(searchCondForSearch, false);
        } else if (historyMode === HistoryMode.REPLACE) {
          registerHistory(searchCondForSearch, true);
        }

        state.searching = false;
        state.show = true;
      })
      .catch((error: unknown) => {
        state.searching = false;

        // Structure error information for better debugging and monitoring
        console.error('Search operation failed', {
          operation: 'doSearch',
          searchCondition: {
            query: searchCondForSearch.q,
            page: searchCondForSearch.page,
            pageSize: searchCondForSearch.pageSize,
            label: searchCondForSearch.label,
            sort: searchCondForSearch.sort,
          },
          historyMode,
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
        });
      });
  };

  /**
   * Scroll to the top of search results box
   *
   * This is an internal helper to scroll the viewport to the search results
   * when performing subsequent searches.
   */
  const scrollToSearchResults = (): void => {
    const boxEle = document.querySelector('#search-result-box');
    if (boxEle) {
      const top = boxEle.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: top,
        behavior: 'instant' as ScrollBehavior,
      });
    }
  };

  /**
   * Determine if an automatic search is necessary based on URL parameters
   *
   * Checks if the URL contains a search query parameter that should
   * trigger an automatic search on page load.
   *
   * @param params - URL parameters
   * @returns True if automatic search should be triggered
   */
  const isAutoSearchCase = (params: UrlParameters): boolean => {
    return params['fss.query'] !== undefined;
  };

  /**
   * Create search condition object from URL parameters
   *
   * Parses URL parameters and constructs a SearchCondition object
   * with the appropriate query, label, and sort parameters.
   *
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
   *
   * This function tracks search queries in Google Analytics by sending
   * a pageview event with the search parameters.
   *
   * @param searchCond - Search condition to track
   */
  const sendGA = (searchCond: SearchCondition): void => {
    // Check if Google Analytics is available
    // Using window.ga for safe global variable access
    if (typeof window !== 'undefined' && typeof window.ga !== 'undefined') {
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
      window.ga('send', 'pageview', u);
    }
  };

  /**
   * Show FSS and Fess version for debugging purposes
   *
   * Logs the version information for both the FSS client library
   * and the Fess server to the console.
   *
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
      .catch((error: unknown) => {
        import('@/../package.json').then((pkg) => {
          console.log('fss:' + pkg.version);

          // Structure error information for better debugging and monitoring
          console.error('Failed to retrieve Fess version', {
            operation: 'showVersion',
            fessUrl,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
          });
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
