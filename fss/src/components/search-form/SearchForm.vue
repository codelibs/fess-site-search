<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import SearchEvent from '@/events/SearchEvent';
import FormEvent from '@/events/FormEvent';
import SuggestEvent from '@/events/SuggestEvent';
import MessageService from '@/service/MessageService';
import SuggestBox from '@/components/search-form/SuggestBox.vue';

/**
 * Component for search form.
 */

// Props interface
interface Props {
  resultPage?: string;
  language?: string;
  enableSuggest?: boolean;
  suggestUrl?: string;
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  resultPage: '',
  language: '',
  enableSuggest: false,
  suggestUrl: '',
});

// State interface
interface State {
  query: string;
}

// Reactive state
const state = reactive<State>({
  query: '',
});

// Initialize message service
const messageService = new MessageService(props.language);

/**
 * Submit the form.
 * If resultPage is empty, search on the current page.
 * Otherwise, navigate to the result page.
 */
const submit = (event: Event): void => {
  if (props.resultPage === '') {
    // Process on current page if resultPage is empty
    const searchCond = SearchEvent.getInitialSearchCond();
    if (state.query !== '') {
      searchCond.q = state.query;
    }
    // Emit search event
    SearchEvent.emitBasicSearch(searchCond);
    // Cancel suggest
    SuggestEvent.$emitCancel('fss');
    event.preventDefault();
  }
  // If resultPage is set, let the form submit naturally (navigate to resultPage)
};

// Component lifecycle
onMounted(() => {
  // Handle updates to form value by other components
  FormEvent.onUpdateFormValue((data: string) => {
    state.query = data;
  });

  // Handle the selection of suggest
  SuggestEvent.$onResult('fss', (data: string) => {
    state.query = data;
    const searchCond = SearchEvent.getInitialSearchCond();
    searchCond.q = state.query;
    SearchEvent.emitBasicSearch(searchCond);
  });
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
          {{ messageService.get('form.search.button', {}) }}
        </button>
      </div>
    </div>
  </form>
</template>
