import Vue from "vue";

class SearchEvent extends Vue {
  sendBasicSearch(searchCond) {
    searchCond.addition.scrollTop = false;
    this.$emit(this.BASIC_SEARCH, searchCond);
  }

  sendBasicSearchWithScroll(searchCond) {
    searchCond.addition.scrollTop = true;
    this.$emit(this.BASIC_SEARCH, searchCond);
  }

  handleBasicSearch(callback) {
    this.$on(this.BASIC_SEARCH, callback);
  }

  getInitialSearchCond() {
    return {
      q: '',
      sort: '',
      label: '',
      page: 1,
      pageSize: 10,
      addition: {
        scrollTop: false,
      },
    };
  }

  copySearchCond(searchCond) {
    const dest = {...searchCond};
    dest.addition = {...dest.addition};
    return dest;
  }

  get BASIC_SEARCH() {
    return 'basic-search';
  }
}

export default new SearchEvent();
