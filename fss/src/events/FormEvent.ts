/**
 * FormEvent - Form-related event management
 *
 * This module handles form update events, allowing components to communicate
 * when form values need to be updated across the application.
 */

import EventBus from '@/events/EventBus';
import type { EventHandler } from '@/types/event.types';

/**
 * FormEvent class
 *
 * Manages form-related events, specifically form value updates.
 */
class FormEvent extends EventBus {
  /**
   * Event name constant for form value updates
   */
  private readonly UPDATE_FORM_VALUE = 'update-form-value';

  /**
   * Emit a form value update event
   *
   * @param value - The new form value to be set
   */
  emitUpdateFormValue(value: string): void {
    this.emit(this.UPDATE_FORM_VALUE, value);
  }

  /**
   * Register a handler for form value update events
   *
   * @param handler - Function to be called when form value is updated
   */
  onUpdateFormValue(handler: EventHandler<string>): void {
    this.on(this.UPDATE_FORM_VALUE, handler);
  }
}

/**
 * Singleton instance of FormEvent
 *
 * This ensures all components use the same event bus instance
 * for form-related events.
 */
export default new FormEvent();
