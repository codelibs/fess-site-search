/**
 * FrontHelper.ts
 *
 * This module provides helper functions for frontend operations,
 * including URL parameter parsing and browser history management.
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
 * Factory function that creates front helper utilities
 * @returns Object containing helper functions
 */
export default function (): FrontHelperFunctions {
  /**
   * Parse and extract URL parameters from current location
   * @returns URL parameters as key-value pairs (values are arrays)
   */
  const getUrlParameters = (): UrlParameters => {
    let hash = '';
    let url = location.href;
    if (url.indexOf('#') !== -1) {
      const array = url.split('#');
      url = array[0] ?? '';
      hash = array[1] ?? '';
    }

    // Parse url parameters.
    const params = ((url: string): Record<string, string[]> => {
      const params: Record<string, string[]> = {};
      if (url.indexOf('?') !== -1) {
        const array = url.split('?');
        const queryString = array[1];
        if (queryString) {
          const paramArray = queryString.split('&');
          paramArray.forEach((val) => {
            const tpl = val.split('=');
            const key = decodeURIComponent(tpl[0] ?? '');
            let value = '';
            if (tpl.length > 1 && tpl[1]) {
              value = decodeURIComponent(tpl[1].replace(/\+/g, '%20'));
            }

            if (params[key] === undefined) {
              params[key] = [value];
            } else {
              params[key].push(value);
            }
          });
        }
      }
      return params;
    })(url);

    params['fess_url_hash'] = [hash];
    return params as UrlParameters;
  };

  /**
   * Get current history state
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

  return {
    getUrlParameters,
    getHistoryState,
    registerHistory,
  };
}