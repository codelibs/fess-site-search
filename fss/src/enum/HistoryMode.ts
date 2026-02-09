/**
 * HistoryMode.ts
 *
 * Defines how browser history should be managed when performing searches.
 * - PUSH: Adds a new entry to the history stack
 * - REPLACE: Replaces the current history entry
 * - NONE: Does not modify browser history
 */

export enum HistoryMode {
  PUSH = 0,
  REPLACE = 1,
  NONE = -1,
}

export default HistoryMode;