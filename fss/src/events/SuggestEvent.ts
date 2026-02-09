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
 * SuggestEvent class
 *
 * Manages suggestion-related events with dynamic event name generation
 * to support multiple independent suggestion components.
 */
class SuggestEvent extends EventBus {
  /**
   * Emit a suggestion request event
   *
   * @param type - Suggestion type/identifier to distinguish different suggest instances
   * @param value - The input value for which suggestions are requested
   */
  $emit(type: string, value: string): void {
    this.emit('suggest-event-' + type, value);
  }

  /**
   * Register a handler for suggestion request events
   *
   * @param type - Suggestion type/identifier
   * @param handler - Function to be called when suggestion is requested
   */
  $on(type: string, handler: EventHandler<string>): void {
    this.on('suggest-event-' + type, handler);
  }

  /**
   * Emit a suggestion result event
   *
   * @param type - Suggestion type/identifier
   * @param value - The suggestion result data
   */
  $emitResult(type: string, value: string): void {
    this.emit('suggest-result-' + type, value);
  }

  /**
   * Register a handler for suggestion result events
   *
   * @param type - Suggestion type/identifier
   * @param handler - Function to be called when suggestion results are available
   */
  $onResult(type: string, handler: EventHandler<string>): void {
    this.on('suggest-result-' + type, handler);
  }

  /**
   * Emit a suggestion cancellation event
   *
   * Used to signal that the suggestion request should be cancelled
   * (e.g., when the user closes the suggestion dropdown).
   *
   * @param type - Suggestion type/identifier
   */
  $emitCancel(type: string): void {
    this.emit('suggest-cancel-' + type, '');
  }

  /**
   * Register a handler for suggestion cancellation events
   *
   * @param type - Suggestion type/identifier
   * @param handler - Function to be called when suggestion is cancelled
   */
  $onCancel(type: string, handler: EventHandler<string>): void {
    this.on('suggest-cancel-' + type, handler);
  }
}

/**
 * Singleton instance of SuggestEvent
 *
 * This ensures all components use the same event bus instance
 * for suggestion-related events.
 */
export default new SuggestEvent();
