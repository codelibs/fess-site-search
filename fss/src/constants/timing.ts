/**
 * Timing constants for suggest functionality.
 * These constants define delay durations used throughout the application.
 */

/**
 * Debounce delay for suggest API calls in milliseconds.
 * This delay prevents excessive API calls while the user is typing.
 * Reduced from 500ms to 300ms for better user experience.
 */
export const SUGGEST_DEBOUNCE_DELAY_MS = 300 as const;

/**
 * Delay before canceling suggest box in milliseconds.
 * This short delay allows time for mouse interactions before hiding the suggest box.
 */
export const SUGGEST_CANCEL_DELAY_MS = 100 as const;
