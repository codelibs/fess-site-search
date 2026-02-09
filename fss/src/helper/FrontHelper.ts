/**
 * FrontHelper.ts
 *
 * Legacy adapter for backward compatibility.
 * This module re-exports the useFrontHelper composable as a factory function
 * to maintain compatibility with existing code.
 *
 * @deprecated Use `useFrontHelper` composable directly instead.
 * @see {@link useFrontHelper}
 */

import { useFrontHelper } from '@/composables/useFrontHelper';

// Re-export types for backward compatibility
export type {
  UrlParameters,
  HistoryState,
  FrontHelperFunctions,
} from '@/composables/useFrontHelper';

/**
 * Factory function that creates front helper utilities
 *
 * This function maintains backward compatibility by wrapping the
 * useFrontHelper composable. New code should use useFrontHelper directly.
 *
 * @returns Object containing helper functions
 * @deprecated Use `useFrontHelper()` directly
 */
export default function () {
  return useFrontHelper();
}