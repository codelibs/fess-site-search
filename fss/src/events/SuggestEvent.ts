/**
 * SuggestEvent - Suggestion-related event management
 *
 * This module handles suggestion (autocomplete) events, including
 * suggestion requests, results, and cancellations.
 *
 * The event naming pattern uses dynamic suffixes to support multiple
 * suggestion instances (e.g., suggest-event-{type}, suggest-result-{type}).
 */

import EventBus from '@/events/EventBus';
import type { EventHandler } from '@/types/event.types';

/**
 * Event name prefix constants for type safety
 *
 * These constants ensure consistent event naming and prevent typos.
 */
const EventPrefix = {
  EVENT: 'suggest-event-',
  RESULT: 'suggest-result-',
  CANCEL: 'suggest-cancel-',
} as const;

/**
 * Type guard for suggestion type identifiers
 *
 * Ensures that suggestion type identifiers are non-empty strings
 * to prevent accidental empty event names.
 */
function validateSuggestType(type: string): asserts type is string {
  if (!type || type.trim().length === 0) {
    throw new Error('Suggestion type identifier cannot be empty');
  }
}

/**
 * Build event name with prefix
 *
 * Creates a fully qualified event name by combining a prefix with a type identifier.
 * This function provides a single point of control for event name generation.
 *
 * @param prefix - Event prefix constant
 * @param type - Suggestion type identifier
 * @returns Fully qualified event name
 */
function buildEventName(prefix: string, type: string): string {
  validateSuggestType(type);
  return prefix + type;
}

/**
 * SuggestEvent class
 *
 * Manages suggestion-related events with dynamic event name generation
 * to support multiple independent suggestion components.
 *
 * This implementation uses constant prefixes and a helper function
 * to ensure type safety and consistency in event naming.
 */
class SuggestEvent extends EventBus {
  /**
   * Emit a suggestion request event
   *
   * This event is emitted when a user types in an input field and
   * suggestions should be fetched and displayed.
   *
   * @param type - Suggestion type/identifier to distinguish different suggest instances
   * @param value - The input value for which suggestions are requested
   */
  $emit(type: string, value: string): void {
    this.emit<string>(buildEventName(EventPrefix.EVENT, type), value);
  }

  /**
   * Register a handler for suggestion request events
   *
   * The handler will be called whenever a suggestion request is emitted
   * for the specified type.
   *
   * @param type - Suggestion type/identifier
   * @param handler - Function to be called when suggestion is requested
   */
  $on(type: string, handler: EventHandler<string>): void {
    this.on<string>(buildEventName(EventPrefix.EVENT, type), handler);
  }

  /**
   * Emit a suggestion result event
   *
   * This event is emitted when suggestion results are ready to be displayed.
   *
   * @param type - Suggestion type/identifier
   * @param value - The suggestion result data
   */
  $emitResult(type: string, value: string): void {
    this.emit<string>(buildEventName(EventPrefix.RESULT, type), value);
  }

  /**
   * Register a handler for suggestion result events
   *
   * The handler will be called when suggestion results are available
   * for the specified type.
   *
   * @param type - Suggestion type/identifier
   * @param handler - Function to be called when suggestion results are available
   */
  $onResult(type: string, handler: EventHandler<string>): void {
    this.on<string>(buildEventName(EventPrefix.RESULT, type), handler);
  }

  /**
   * Emit a suggestion cancellation event
   *
   * Used to signal that the suggestion request should be cancelled
   * (e.g., when the user closes the suggestion dropdown or clears the input).
   *
   * @param type - Suggestion type/identifier
   */
  $emitCancel(type: string): void {
    // Empty string payload indicates cancellation without additional data
    this.emit<string>(buildEventName(EventPrefix.CANCEL, type), '');
  }

  /**
   * Register a handler for suggestion cancellation events
   *
   * The handler will be called when a suggestion cancellation is triggered
   * for the specified type.
   *
   * @param type - Suggestion type/identifier
   * @param handler - Function to be called when suggestion is cancelled
   */
  $onCancel(type: string, handler: EventHandler<string>): void {
    this.on<string>(buildEventName(EventPrefix.CANCEL, type), handler);
  }

  /**
   * Unregister a handler for suggestion request events
   *
   * Removes the specified handler from the suggestion request event.
   * Should be called during component cleanup to prevent memory leaks.
   *
   * @param type - Suggestion type/identifier
   * @param handler - Function to be removed
   */
  $off(type: string, handler: EventHandler<string>): void {
    this.off<string>(buildEventName(EventPrefix.EVENT, type), handler);
  }

  /**
   * Unregister a handler for suggestion result events
   *
   * Removes the specified handler from the suggestion result event.
   * Should be called during component cleanup to prevent memory leaks.
   *
   * @param type - Suggestion type/identifier
   * @param handler - Function to be removed
   */
  $offResult(type: string, handler: EventHandler<string>): void {
    this.off<string>(buildEventName(EventPrefix.RESULT, type), handler);
  }

  /**
   * Unregister a handler for suggestion cancellation events
   *
   * Removes the specified handler from the suggestion cancellation event.
   * Should be called during component cleanup to prevent memory leaks.
   *
   * @param type - Suggestion type/identifier
   * @param handler - Function to be removed
   */
  $offCancel(type: string, handler: EventHandler<string>): void {
    this.off<string>(buildEventName(EventPrefix.CANCEL, type), handler);
  }
}

/**
 * Singleton instance of SuggestEvent
 *
 * This ensures all components use the same event bus instance
 * for suggestion-related events.
 */
export default new SuggestEvent();
