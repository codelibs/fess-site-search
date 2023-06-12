import EventBus from '@/events/EventBus';

class SuggestEvent extends EventBus {
  $emit(type, value) {
    this.emit("suggest-event-" + type, value);
  }

  $on(type, handler) {
    this.on("suggest-event-" + type, handler);
  }

  $emitResult(type, value) {
    this.emit("suggest-result-" + type, value);
  }

  $onResult(type, handler) {
    this.on("suggest-result-" + type, handler);
  }

  $emitCancel(type, value) {
    this.emit("suggest-cancel-" + type, value);
  }

  $onCancel(type, handler) {
    this.on("suggest-cancel-" + type, handler);
  }
}

export default new SuggestEvent();