
import EventBus from '@/events/EventBus';

class SearchEvent extends EventBus {

  emitBasicSearch(searchCond) {
    searchCond.addition.scrollTop = false;
    this.emit(this.BASIC_SEARCH, searchCond);
  }

  emitBasicSearchWithScroll(searchCond) {
    searchCond.addition.scrollTop = true;
    this.emit(this.BASIC_SEARCH, searchCond);
  }

  onBasicSearch(handler) {
    this.on(this.BASIC_SEARCH, handler);
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