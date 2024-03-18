export default class {
  constructor() {
    this.handlers = {};
  }

  emit(type, data) {
    if (type in this.handlers) {
      this.handlers[type].forEach((handler) => {
        handler(data);
      });
    } else {
      console.warn('No handler for event:', type);
    }
  }

  on(type, handler) {
    if (type in this.handlers === false) {
      this.handlers[type] = [];
    }
    this.handlers[type].push(handler);
  }
}