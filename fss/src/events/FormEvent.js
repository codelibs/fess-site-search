import Vue from "vue";

class FormEvent extends Vue {
  updateFormValue(value) {
    this.$emit('update-form-value', value);
  }

  handleUpdateFormValue(callback) {
    this.$on('update-form-value', callback);
  }
}

export default new FormEvent();
