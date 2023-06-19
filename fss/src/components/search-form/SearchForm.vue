<script>
import { defineComponent, reactive, onMounted } from "vue";

import SearchEvent from '@/events/SearchEvent';
import FormEvent from '@/events/FormEvent';
import SuggestEvent from '@/events/SuggestEvent';
import MessageService from '@/service/MessageService';

import SuggestBox from "@/components/search-form/SuggestBox";

export default defineComponent({

  components: {
    "suggest-box": SuggestBox
  },
  props: {
    resultPage: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: '',
    },
    enableSuggest: {
      type: Boolean,
      default: false,
    },
    suggestUrl: {
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
      FormEvent.onUpdateFormValue((data) => {
        state.query = data;
      });

      SuggestEvent.$onResult('fss', (data) => {
        state.query = data;
        const searchCond = SearchEvent.getInitialSearchCond();
        if (state.query !== '') {
          searchCond.q = state.query;
        }
        SearchEvent.emitBasicSearch(searchCond);
      });
    });

    // method definitions
    const submit = (event) => {
      if (props.resultPage === '') {
        const searchCond = SearchEvent.getInitialSearchCond();
        if (state.query !== '') {
          searchCond.q = state.query;
        }
        SearchEvent.emitBasicSearch(searchCond);
        SuggestEvent.$emitCancel('fss');
        event.preventDefault();
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
  <form :action="resultPage" method="GET" styleId="searchForm" @submit="submit">
    <div class="form-row align-items-center">
      <div class="col-auto">
        <div class="">
          <input id="contentQuery" v-model="state.query" type="text" name="fss.query" maxlength="1000" size="50" class="query form-control" autocomplete="off">
          <suggest-box
            v-if="enableSuggest"
            suggest-id="fss"
            target-element-id="contentQuery"
            :api-url="suggestUrl"
          />
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
