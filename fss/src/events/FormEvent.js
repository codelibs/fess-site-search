import EventBus from '@/events/EventBus';

class FormEvent extends EventBus {
  emitUpdateFormValue(value) {
    this.emit(this.UPDATE_FORM_VALUE, value);
  }

  onUpdateFormValue(value) {
    this.on(this.UPDATE_FORM_VALUE, value);
  }

  get UPDATE_FORM_VALUE() {
    return 'update-form-value';
  }
}

export default new FormEvent();
