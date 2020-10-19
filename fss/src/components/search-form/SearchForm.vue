<script>
import SearchEvent from '@/events/SearchEvent';
import FormEvent from '@/events/FormEvent';
import FrontHelper from '@/helper/FrontHelper';
import MessageService from '@/service/MessageService';

export default {
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
  data: function() {
    return {
      query: '',
      message: new MessageService(this.language),
    };
  },
  mounted: function() {
    FormEvent.handleUpdateFormValue((value) => {
      this.query = value;
    });
  },
  methods: {
    submit(event) {
      if (this.resultPage === '') {
        const searchCond = SearchEvent.getInitialSearchCond();
        if (this.query !== '') {
          searchCond.q = this.query;
        }
        SearchEvent.sendBasicSearch(searchCond);
        event.preventDefault();
        return;
      }
    }
  }
};
</script>

<template>
  <form :action="resultPage" method="get" styleId="searchForm" @submit="submit">
    <div class="form-row align-items-center">
      <div class="col-auto">
        <div class="">
          <input id="contentQuery" v-model="query" type="text" name="fss.query" maxlength="1000" size="50" value="" class="query form-control" autocomplete="off">
        </div>
      </div>
      <div class="col-auto btn-group">
        <button id="searchButton" type="submit" name="search" class="btn btn-primary">
          {{ message.get('form.search.button', {}, language) }}
        </button>
      </div>
    </div>
  </form>
</template>