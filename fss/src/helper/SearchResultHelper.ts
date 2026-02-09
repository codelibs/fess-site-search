/**
 * SearchResultHelper.ts
 *
 * Legacy adapter for backward compatibility.
 * This module re-exports the useSearchResultHelper composable as a factory function
 * to maintain compatibility with existing code.
 *
 * @deprecated Use `useSearchResultHelper` composable directly instead.
 * @see {@link useSearchResultHelper}
 */

import { useSearchResultHelper } from '@/composables/useSearchResultHelper';

// Re-export types for backward compatibility
export type { SearchResultHelperFunctions } from '@/composables/useSearchResultHelper';

/**
 * Factory function that creates search result helper utilities
 *
 * This function maintains backward compatibility by wrapping the
 * useSearchResultHelper composable. New code should use useSearchResultHelper directly.
 *
 * @returns Object containing search result helper functions
 * @deprecated Use `useSearchResultHelper()` directly
 */
export default function () {
  return useSearchResultHelper();
}
