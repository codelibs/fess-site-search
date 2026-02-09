/**
 * SuggestHelper.ts
 *
 * This module provides helper functions for suggest functionality,
 * including positioning the suggestion box and executing suggestion queries.
 */

import SearchService from '@/service/SearchService';

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
  newData: unknown;
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
 * Factory function that creates suggest helper utilities
 * @returns Object containing suggest helper functions
 */
export default function (): SuggestHelperFunctions {
  /**
   * Adjusts the display position of the suggestion box for optimal visibility
   * @param suggestState - Suggest box state object to update
   * @param targetElement - Target input element to position relative to
   */
  const adjustBox = (suggestState: SuggestState, targetElement: HTMLElement | null): void => {
    if (targetElement === null) {
      return;
    }
    suggestState.left = _suggestFormLeft(targetElement);
    suggestState.top = _suggestFormTop(targetElement);
    suggestState.width = _suggestFormWidth(targetElement);
  };

  /**
   * Calculate left position for suggest box
   * @param targetElement - Target element
   * @returns Left position in pixels
   */
  const _suggestFormLeft = (targetElement: HTMLElement): string => {
    const rect = targetElement.getBoundingClientRect();
    return rect.left + 'px';
  };

  /**
   * Calculate top position for suggest box
   * @param targetElement - Target element
   * @returns Top position in pixels
   */
  const _suggestFormTop = (targetElement: HTMLElement): string => {
    const rect = targetElement.getBoundingClientRect();
    return rect.top + rect.height + 'px';
  };

  /**
   * Calculate width for suggest box
   * @param targetElement - Target element
   * @returns Width in pixels
   */
  const _suggestFormWidth = (targetElement: HTMLElement): string => {
    const rect = targetElement.getBoundingClientRect();
    return rect.width + 'px';
  };

  /**
   * Execute suggest query and return suggestion list
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
    const resultList = await searchService.suggest(keyword, num, labels, [], ['_default', 'content', 'title']);
    return resultList;
  };

  return {
    adjustBox,
    doSuggest,
  };
}