import FrontHelper from "@/helper/FrontHelper";
import SearchService from "@/service/SearchService";
import HistoryMode from "@/enum/HistoryMode";
import SearchEvent from "@/events/SearchEvent";
import FormEvent from "@/events/FormEvent";
import ResultHeader from "@/components/search-result/ResultHeader";
import ResultItem from "@/components/search-result/ResultItem";
import ResultPagination from "@/components/search-result/ResultPagination";


export default function () {
  const _searchInternal = (searchCond, historyMode) => {
    const copiedSearchCond = SearchEvent.copySearchCond(searchCond);
    copiedSearchCond.pageSize = this.pageSize;
    if (this.searching) {
      console.log('Now searching...');
      return;
    }

    this.$emit('update-form-value', copiedSearchCond.q);
    //FormEvent.updateFormValue(copiedSearchCond.q);
    if (typeof ga == 'function') {
      this._sendGA(copiedSearchCond);
    }

    this.searching = true;
    const searchService = new SearchService(this.fessUrl);
    searchService.search(copiedSearchCond, this).then((res) => {
      this.searchCond = copiedSearchCond;
      if (copiedSearchCond.addition.scrollTop) {
        const boxEle = document.querySelector('#search-result-box');
        const top = boxEle.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: top,
          behavior: "instant",
        });
        copiedSearchCond.addition.scrollTop = false;
      }
      if (historyMode === HistoryMode.PUSH) {
        FrontHelper.registerHistory(copiedSearchCond, false);
      } else if (historyMode === HistoryMode.REPLACE) {
        FrontHelper.registerHistory(copiedSearchCond, true);
      }
      this.searching = false;
      this.show = true;
    }).catch((res) => {
      this.searching = false;
      console.log('Search error. ' + res);
    });
  };

  const _isAutoSearchCase = (params) => {
    return params['fss.query'] !== undefined;
  };

  const _createSearchCondFromParameter = (params) => {
    const searchCond = SearchEvent.getInitialSearchCond();
    if (params['fss.query'] !== undefined) {
      searchCond.q = params['fss.query'][0];
    }
    if (params['fss.label'] !== undefined) {
      searchCond.label = params['fss.label'][0];
    }
    if (params['fss.sort'] !== undefined) {
      searchCond.sort = params['fss.sort'][0];
    }
    return searchCond;
  };

  const _sendGA = (searchCond) => {
    if (typeof ga == 'function') {
      let u = '/' + window.location.pathname + '?q=' + encodeURIComponent(searchCond.q);
      if (searchCond.page) {
        u = u + '&page=' + searchCond.page;
      }
      if (searchCond.pageSize) {
        u = u + '&pageSize=' + searchCond.pageSize;
      }
      if (searchCond.sort) {
        u = u + '&sort=' + searchCond.sort;
      }
      if (searchCond.label) {
        u = u + '&fields.label=' + searchCond.label;
      }
      ga('send', 'pageview', u); // eslint-disable-line
    }
  };

  const _showVersion = () => {
    const searchService = new SearchService(this.fessUrl);
    searchService.getFessVersion().then((fessVersion) => {
      console.log('fss:' + require('@/../package.json').version + ' fess:' + fessVersion);
    }).catch((e) => {
      console.log('fss:' + require('@/../package.json').version);
      console.error('Failed to get fess version.');
      console.error(e);
    });
  };

  return {
    _searchInternal,
    _isAutoSearchCase,
    _createSearchCondFromParameter,
    _sendGA,
    _showVersion
  };
}