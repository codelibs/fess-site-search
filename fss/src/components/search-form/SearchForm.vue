<script>
import { defineComponent, reactive, onMounted } from "vue";

import SearchEvent from '@/events/SearchEvent';
import FormEvent from '@/events/FormEvent';
import SuggestEvent from '@/events/SuggestEvent';
import MessageService from '@/service/MessageService';

import SuggestBox from "@/components/search-form/SuggestBox";

/**
 * Component for search form.
 */
export default defineComponent({

  components: {
    "suggest-box": SuggestBox
  },
  props: {
    // The path to the search results page, if exists.
    resultPage: {
      type: String,
      default: '',
    },
    // Language for search.
    language: {
      type: String,
      default: '',
    },
    // Enable suggest.
    enableSuggest: {
      type: Boolean,
      default: false,
    },
    // URL of suggest api.
    suggestUrl: {
      type: String,
      default: '',
    }
  },

  setup(props) {
    // reactive data
    const state = reactive({
      query: ''
    });

    onMounted(() => {
      // Handle updates to form value by other components.
      FormEvent.onUpdateFormValue((data) => {
        state.query = data;
      });

      // Handle the selection of suggest.
      SuggestEvent.$onResult('fss', (data) => {
        state.query = data;
        const searchCond = SearchEvent.getInitialSearchCond();
        searchCond.q = state.query;
        SearchEvent.emitBasicSearch(searchCond);
      });
    });

    const messageService = new MessageService(props.language);


    // method definitions

    /**
     * Submit the form.
     * If resultPage is empty, search on the current page.
     */
    const submit = (event) => {
      if (props.resultPage === '') {
        // Process on current page if resultPage is empty.
        const searchCond = SearchEvent.getInitialSearchCond();
        if (state.query !== '') {
          searchCond.q = state.query;
        }
        // Emit search event.
        SearchEvent.emitBasicSearch(searchCond);
        // Cancel suggest.
        SuggestEvent.$emitCancel('fss');
        event.preventDefault();
        return;
      }
    };

    return {
      state,
      messageService,
      submit,
    };
  },
});
</script>


<template>
  <form :action="resultPage" method="GET" class="fessForm" styleId="searchForm" @submit="submit">
    <div class="row g-2 fss-form-row align-items-center">
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
        <button type="submit" name="search" class="searchButton btn btn-primary">
          {{ messageService.get('form.search.button', {}, language) }}
        </button>
      </div>
    </div>
  </form>
</template>
