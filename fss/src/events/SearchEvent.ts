/**
 * SearchEvent - Search-related event management
 *
 * This module handles search-related events including basic search,
 * search with scroll, and provides utility methods for search conditions.
 */

import EventBus from '@/events/EventBus';
import type { SearchCondition } from '@/types/search.types';
import type { EventHandler } from '@/types/event.types';

/**
 * SearchEvent class
 *
 * Manages search-related events and provides methods for emitting
 * and listening to search events.
 */
class SearchEvent extends EventBus {
  /**
   * Event name constant for basic search
   */
  private readonly BASIC_SEARCH = 'basic-search';

  /**
   * Emit a basic search event without scrolling to top
   *
   * @param searchCond - Search condition parameters
   */
  emitBasicSearch(searchCond: SearchCondition): void {
    // Ensure addition object exists with explicit initialization
    if (!searchCond.addition) {
      searchCond.addition = {};
    }
    searchCond.addition.scrollTop = false;
    this.emit(this.BASIC_SEARCH, searchCond);
  }

  /**
   * Emit a basic search event with scrolling to top
   *
   * @param searchCond - Search condition parameters
   */
  emitBasicSearchWithScroll(searchCond: SearchCondition): void {
    // Ensure addition object exists with explicit initialization
    if (!searchCond.addition) {
      searchCond.addition = {};
    }
    searchCond.addition.scrollTop = true;
    this.emit(this.BASIC_SEARCH, searchCond);
  }

  /**
   * Register a handler for basic search events
   *
   * @param handler - Function to be called when basic search is emitted
   */
  onBasicSearch(handler: EventHandler<SearchCondition>): void {
    this.on(this.BASIC_SEARCH, handler);
  }

  /**
   * Unregister a handler for basic search events
   *
   * @param handler - Function to be removed
   */
  offBasicSearch(handler: EventHandler<SearchCondition>): void {
    this.off(this.BASIC_SEARCH, handler);
  }

  /**
   * Get initial search condition with default values
   *
   * @returns Initial search condition object
   */
  getInitialSearchCond(): SearchCondition {
    return {
      q: '',
      sort: '',
      label: '',
      page: 1,
      pageSize: 10,
      addition: {
        scrollTop: false,
      },
    };
  }

  /**
   * Create a deep copy of search condition
   *
   * This is useful to avoid mutating the original search condition object.
   *
   * @param searchCond - Search condition to copy
   * @returns Deep copy of the search condition
   */
  copySearchCond(searchCond: SearchCondition): SearchCondition {
    const dest = { ...searchCond };
    // Deep copy the addition object to avoid shared references
    dest.addition = { ...dest.addition };
    return dest;
  }
}

/**
 * Singleton instance of SearchEvent
 *
 * This ensures all components use the same event bus instance
 * for search-related events.
 */
export default new SearchEvent();
