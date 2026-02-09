/**
 * Event-related type definitions
 *
 * This file defines types for the application's event bus system,
 * ensuring type-safe event emission and handling.
 */

import type { SearchCondition } from './search.types';

/**
 * Generic event handler type
 */
export type EventHandler<T = unknown> = (data: T) => void;

/**
 * Event handlers map
 * Maps event names to arrays of handler functions
 *
 * @deprecated This type is now internal to EventBus and uses Map instead.
 * External code should not need to reference this type directly.
 */
export type EventHandlers = {
  [eventName: string]: EventHandler<unknown>[];
};

/**
 * Base EventBus interface
 * Defines the contract for event bus implementations
 */
export interface IEventBus {
  emit<T>(type: string, data: T): void;
  on<T>(type: string, handler: EventHandler<T>): void;
  off<T>(type: string, handler: EventHandler<T>): void;
}

/**
 * Event map for strongly-typed events
 *
 * This type defines all known events in the application with their payload types.
 * Note: The actual implementation also supports dynamic event names (e.g., suggest-event-{type}).
 */
export type KnownEvents = {
  'basic-search': SearchCondition;
  'update-form-value': string;
};
