/**
 * HistoryMode.ts
 *
 * Defines how browser history should be managed when performing searches.
 */

export enum HistoryMode {
  /**
   * Adds a new entry to the history stack (history.pushState)
   * Use when performing a new search that should be navigable via browser back/forward
   */
  PUSH = 0,

  /**
   * Replaces the current history entry (history.replaceState)
   * Use when updating search results without adding to browser history
   * Useful for pagination or filter changes within the same search context
   */
  REPLACE = 1,

  /**
   * Does not modify browser history
   * Use when search should not affect browser navigation at all
   * Typically for temporary or preview searches
   */
  NONE = -1,
}

export default HistoryMode;