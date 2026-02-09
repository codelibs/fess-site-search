/**
 * SuggestHelper.ts
 *
 * Legacy adapter for backward compatibility.
 * This module re-exports the useSuggestHelper composable as a factory function
 * to maintain compatibility with existing code.
 *
 * @deprecated Use `useSuggestHelper` composable directly instead.
 * @see {@link useSuggestHelper}
 */

import { useSuggestHelper } from '@/composables/useSuggestHelper';

// Re-export types for backward compatibility
export type { SuggestState, SuggestHelperFunctions } from '@/composables/useSuggestHelper';

/**
 * Factory function that creates suggest helper utilities
 *
 * This function maintains backward compatibility by wrapping the
 * useSuggestHelper composable. New code should use useSuggestHelper directly.
 *
 * @returns Object containing suggest helper functions
 * @deprecated Use `useSuggestHelper()` directly
 */
export default function () {
  return useSuggestHelper();
}