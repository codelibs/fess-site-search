<script>
import { defineComponent, reactive, onMounted } from "vue";

import SearchEvent from '@/events/SearchEvent';
import FormEvent from '@/events/FormEvent';
import MessageService from '@/service/MessageService';

export default defineComponent({
  props: {
    resultPage: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: '',
    }
  },
  setup(props, context) {
    // reactive data
    const state = reactive({
      query: '',
      message: new MessageService(props.language),
    });

    onMounted(() => {
      console.log('form mounted');
      FormEvent.onUpdateFormValue((data) => {
        state.query = data;
      });
    });

    // method definitions
    const submit = () => {
      console.log('form fubmit!!');
      if (props.resultPage === '') {
        const searchCond = SearchEvent.getInitialSearchCond();
        if (state.query !== '') {
          searchCond.q = state.query;
        }
        SearchEvent.emitBasicSearch(searchCond);
        return;
      }
    };

    return {
      state,
      submit,
    };
  },
});
</script>


<template>
  <form method="GET" styleId="searchForm" @submit.prevent="submit">
    <div class="form-row align-items-center">
      <div class="col-auto">
        <div class="">
          <input id="contentQuery" v-model="state.query" type="text" name="fss.query" maxlength="1000" size="50" class="query form-control" autocomplete="off">
        </div>
      </div>
      <div class="col-auto btn-group">
        <button id="searchButton" type="submit" name="search" class="btn btn-primary">
          {{ state.message.get('form.search.button', {}, language) }}
        </button>
      </div>
    </div>
  </form>
</template>
