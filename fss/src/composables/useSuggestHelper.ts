/**
 * useSuggestHelper.ts
 *
 * Vue 3 Composable for suggest functionality, including positioning
 * the suggestion box and executing suggestion queries.
 *
 * This composable includes DOM operation optimizations to minimize
 * expensive getBoundingClientRect() calls.
 */

import SearchService from '@/service/SearchService';

/**
 * Default fields to search in for suggestions
 * - _default: Default Fess field
 * - content: Document content field
 * - title: Document title field
 */
const DEFAULT_SUGGEST_FIELDS: string[] = ['_default', 'content', 'title'];

/**
 * Suggest box positioning state
 */
export interface SuggestState {
  show: boolean;
  suggestList: string[];
  top: string;
  left: string;
  width: string;
  focusNum: number;
  isMouseOver: boolean;
}

/**
 * Suggest helper functions interface
 */
export interface SuggestHelperFunctions {
  adjustBox: (suggestState: SuggestState, targetElement: HTMLElement | null) => void;
  doSuggest: (fessUrl: string, keyword: string, num: number, labels: string[]) => Promise<string[]>;
}

/**
 * Composable that provides suggest helper utilities
 *
 * This composable handles suggestion box positioning and suggestion queries.
 * It includes performance optimizations for DOM operations.
 *
 * @returns Object containing suggest helper functions
 *
 * @example
 * ```typescript
 * import { useSuggestHelper } from '@/composables/useSuggestHelper';
 *
 * const { adjustBox, doSuggest } = useSuggestHelper();
 * adjustBox(suggestState, inputElement);
 * ```
 */
export function useSuggestHelper(): SuggestHelperFunctions {
  /**
   * Adjusts the display position of the suggestion box for optimal visibility
   *
   * This function calculates the position and size of the suggestion box
   * relative to the target input element. It's optimized to call
   * getBoundingClientRect() only once per adjustment.
   *
   * @param suggestState - Suggest box state object to update
   * @param targetElement - Target input element to position relative to
   */
  const adjustBox = (suggestState: SuggestState, targetElement: HTMLElement | null): void => {
    if (targetElement === null) {
      return;
    }

    // DOM optimization: Call getBoundingClientRect() only once and reuse the result
    // getBoundingClientRect() triggers a reflow, which is expensive
    const rect = targetElement.getBoundingClientRect();

    // Calculate all positioning values from the single rect measurement
    suggestState.left = rect.left + 'px';
    suggestState.top = rect.top + rect.height + 'px';
    suggestState.width = rect.width + 'px';
  };

  /**
   * Execute suggest query and return suggestion list
   *
   * This function queries the Fess server for suggestions based on
   * the provided keyword and returns a list of matching suggestions.
   *
   * @param fessUrl - Fess server URL
   * @param keyword - Search keyword for suggestions
   * @param num - Number of suggestions to return
   * @param labels - Label filters for suggestions
   * @returns Promise resolving to list of suggestion strings
   */
  const doSuggest = async (
    fessUrl: string,
    keyword: string,
    num: number,
    labels: string[]
  ): Promise<string[]> => {
    const searchService = new SearchService(fessUrl);
    const resultList = await searchService.suggest(keyword, num, labels, [], DEFAULT_SUGGEST_FIELDS);
    return resultList;
  };

  return {
    adjustBox,
    doSuggest,
  };
}
