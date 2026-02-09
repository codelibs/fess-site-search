/**
 * EventBus - Custom event bus implementation
 *
 * This is a lightweight event bus for managing application-wide events.
 * It provides type-safe event emission and subscription with improved type safety.
 *
 * Note: This is a custom implementation. For future enhancements,
 * consider migrating to a library like 'mitt' for better TypeScript support.
 */

import type { EventHandler, IEventBus } from '@/types/event.types';

/**
 * Internal storage type for event handlers
 *
 * Maps event names to arrays of handler functions. We store handlers
 * with unknown type internally to avoid runtime type issues, but the
 * public API maintains type safety through generics.
 */
type InternalEventHandlers = Map<string, Array<EventHandler<unknown>>>;

/**
 * EventBus class
 *
 * A simple publish-subscribe event bus that allows components to communicate
 * without tight coupling. This implementation uses improved type safety
 * with minimal type assertions.
 */
export default class EventBus implements IEventBus {
  /**
   * Internal event handlers storage
   *
   * Uses Map for better performance and cleaner API compared to plain objects.
   * Map provides O(1) lookups and better ergonomics for checking existence.
   */
  private handlers: InternalEventHandlers;

  constructor() {
    this.handlers = new Map();
  }

  /**
   * Emit an event with optional data
   *
   * Invokes all registered handlers for the specified event type with the provided data.
   * If no handlers are registered, a warning is logged to the console.
   *
   * @param type - Event name
   * @param data - Event payload
   */
  emit<T>(type: string, data: T): void {
    const eventHandlers = this.handlers.get(type);

    if (eventHandlers) {
      // Iterate over a copy to allow handlers to unregister themselves during execution
      const handlersCopy = [...eventHandlers];
      handlersCopy.forEach((handler) => {
        // Type assertion is necessary but safe: handlers registered with on<T>()
        // will only be called with data of type T from emit<T>()
        // This is enforced by TypeScript's generic type system at compile time
        (handler as EventHandler<T>)(data);
      });
    } else {
      console.warn('No handler for event:', type);
    }
  }

  /**
   * Register an event handler
   *
   * Adds a handler function that will be called when the specified event is emitted.
   * Multiple handlers can be registered for the same event type.
   *
   * @param type - Event name
   * @param handler - Handler function to be called when event is emitted
   */
  on<T>(type: string, handler: EventHandler<T>): void {
    // Get or create the handlers array for this event type
    let eventHandlers = this.handlers.get(type);

    if (!eventHandlers) {
      eventHandlers = [];
      this.handlers.set(type, eventHandlers);
    }

    // Store handler with unknown type internally
    // Type safety is maintained at the public API level through generics
    eventHandlers.push(handler as EventHandler<unknown>);
  }

  /**
   * Unregister an event handler
   *
   * Removes a previously registered handler for the specified event type.
   * It's important to call this method to prevent memory leaks when components are unmounted.
   *
   * @param type - Event name
   * @param handler - Handler function to be removed
   */
  off<T>(type: string, handler: EventHandler<T>): void {
    const eventHandlers = this.handlers.get(type);

    if (eventHandlers) {
      // Find the handler in the array
      const index = eventHandlers.indexOf(handler as EventHandler<unknown>);

      if (index !== -1) {
        // Remove the handler
        eventHandlers.splice(index, 1);
      }

      // Clean up the event type entry if no handlers remain
      // This prevents memory leaks from accumulating empty arrays
      if (eventHandlers.length === 0) {
        this.handlers.delete(type);
      }
    }
  }
}
