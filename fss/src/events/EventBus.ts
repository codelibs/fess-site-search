/**
 * EventBus - Custom event bus implementation
 *
 * This is a lightweight event bus for managing application-wide events.
 * It provides type-safe event emission and subscription.
 *
 * Note: This is a custom implementation. For future enhancements,
 * consider migrating to a library like 'mitt' for better TypeScript support.
 */

import type { EventHandler, EventHandlers, IEventBus } from '@/types/event.types';

/**
 * EventBus class
 *
 * A simple publish-subscribe event bus that allows components to communicate
 * without tight coupling.
 */
export default class EventBus implements IEventBus {
  private handlers: EventHandlers;

  constructor() {
    this.handlers = {};
  }

  /**
   * Emit an event with optional data
   *
   * @param type - Event name
   * @param data - Event payload
   */
  emit<T>(type: string, data: T): void {
    const eventHandlers = this.handlers[type];
    if (eventHandlers) {
      eventHandlers.forEach((handler) => {
        // Cast is safe because handlers are registered with the same type
        (handler as EventHandler<T>)(data);
      });
    } else {
      console.warn('No handler for event:', type);
    }
  }

  /**
   * Register an event handler
   *
   * @param type - Event name
   * @param handler - Handler function to be called when event is emitted
   */
  on<T>(type: string, handler: EventHandler<T>): void {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }
    // Non-null assertion is safe because we just initialized it above
    this.handlers[type]!.push(handler as EventHandler<unknown>);
  }
}
