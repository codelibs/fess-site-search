import SearchService from "@/service/SearchService";

/**
 * SuggestHelper.js
 * 
 * This module provides helper functions for suggest.
 */
export default function () {
  /**
   * Adjusts the display position of the suggestion box for optimal visibility.
   * @param {Object} suggestState 
   * @param {HTMLElement} targetElement 
   */
  const adjustBox = (suggestState, targetElement) => {
    if (targetElement === null) {
      return;
    }
    suggestState.left = _suggestFormLeft(targetElement);
    suggestState.top = _suggestFormTop(targetElement);
    suggestState.width = _suggestFormWidth(targetElement);
  };

  const _suggestFormLeft = (targetElement) => {
    const rect = targetElement.getBoundingClientRect();
    return rect.left + 'px';
  };

  const _suggestFormTop = (targetElement) => {
    const rect = targetElement.getBoundingClientRect();
    return (rect.top + rect.height) + 'px';
  };

  const _suggestFormWidth = (targetElement) => {
    const rect = targetElement.getBoundingClientRect();
    return rect.width + 'px';
  };

  /**
   * Execute suggest.
   * @param {String} fessUrl 
   * @param {String} keyword 
   * @param {Number} num 
   * @param {Array<String>} labels 
   * @returns List of suggest words.
   */
  const doSuggest = async (
    fessUrl,
    keyword,
    num,
    labels) => {
    const searchService = new SearchService(fessUrl);
    const resultList = await searchService.suggest(keyword, num, labels, [], ['_default', 'content', 'title']);
    return resultList;
  };

  return {
    adjustBox,
    doSuggest
  };
}