/**
 * useFrontHelper.ts
 *
 * Vue 3 Composable for frontend operations, including URL parameter parsing
 * and browser history management.
 *
 * This composable provides stateless utility functions that can be used
 * across components without singleton caching patterns.
 */

import type { SearchCondition } from '@/types/search.types';

/**
 * URL parameters structure
 * Keys are parameter names, values are arrays of parameter values
 * (to support multiple values for the same parameter)
 */
export interface UrlParameters {
  [key: string]: string[];
  fess_url_hash: string[];
}

/**
 * History state structure
 */
export interface HistoryState {
  searchCond: SearchCondition;
}

/**
 * Front helper functions interface
 */
export interface FrontHelperFunctions {
  getUrlParameters: () => UrlParameters;
  getHistoryState: () => HistoryState | null;
  registerHistory: (searchCond: SearchCondition, replace: boolean) => void;
}

/**
 * Composable that provides front helper utilities
 *
 * This composable follows Vue 3 composition API patterns and returns
 * stateless utility functions that can be safely reused across components.
 *
 * @returns Object containing helper functions
 *
 * @example
 * ```typescript
 * import { useFrontHelper } from '@/composables/useFrontHelper';
 *
 * const { getUrlParameters, registerHistory } = useFrontHelper();
 * const params = getUrlParameters();
 * ```
 */
export function useFrontHelper(): FrontHelperFunctions {
  /**
   * Parse and extract URL parameters from current location
   *
   * This function efficiently parses the current URL using native browser APIs
   * to extract query parameters and hash fragments.
   *
   * @returns URL parameters as key-value pairs (values are arrays)
   */
  const getUrlParameters = (): UrlParameters => {
    // Parse URL efficiently using native URL and URLSearchParams APIs
    const url = new URL(location.href);
    const hash = url.hash ? url.hash.substring(1) : '';

    // Use URLSearchParams for efficient parameter parsing
    // Initialize with fess_url_hash to guarantee its existence for type safety
    const params: UrlParameters = {
      fess_url_hash: [hash],
    };

    // URLSearchParams automatically handles decoding and '+' to space conversion
    url.searchParams.forEach((value, key) => {
      if (params[key] === undefined) {
        params[key] = [value];
      } else {
        params[key].push(value);
      }
    });

    return params;
  };

  /**
   * Get current history state
   *
   * Retrieves the current browser history state, which may contain
   * search conditions or other application state.
   *
   * @returns History state object or null if not available
   */
  const getHistoryState = (): HistoryState | null => {
    if (history.state != null) {
      return history.state as HistoryState;
    }
    return null;
  };

  /**
   * Register search condition to browser history
   *
   * This function saves the current search state to browser history,
   * allowing users to navigate back and forward through search results.
   *
   * @param searchCond - Search condition to save in history
   * @param replace - If true, replaces current state; otherwise pushes new state
   */
  const registerHistory = (searchCond: SearchCondition, replace: boolean): void => {
    // Check if history API is available (always available in modern browsers)
    if (typeof window !== 'undefined' && window.history && 'pushState' in window.history) {
      const state: HistoryState = { searchCond };
      if (replace) {
        history.replaceState(state, '');
      } else {
        history.pushState(state, '');
      }
    }
  };

  // Return functions without singleton caching
  // Vue's reactivity system and component lifecycle manage state appropriately
  return {
    getUrlParameters,
    getHistoryState,
    registerHistory,
  };
}
