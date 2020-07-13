import FessJQuery from 'jquery';

export default class {
  constructor(FessView, FessModel, fessVersion) {
    this.FessView = FessView;
    this.FessModel = FessModel;
    this.minFessVersion = 11.4;
    this.fessUrl = FessJQuery('script#fess-ss').attr('fess-url');
    this.fessLang = FessJQuery('script#fess-ss').attr('language');
    this.anyParams = FessJQuery('script#fess-ss').data('params') || {};
    this.urlParams = this._getParameters();
    this.viewState = null;
    this.fessVersion = fessVersion;
  }

  start(fessConfig = {}) {
    this.FessView.init();
    this.viewState = this.FessView.newState();
    this._initViewState(this.viewState, fessConfig);
    this.FessView.render(this.viewState);
    this._bindForm();
    if (this.viewState.popupMode) {
      this.FessView.setupOverlay();
    }
    if (this.viewState.enableSuggest) {
      this.FessModel.getStatus(this.fessUrl).then(data => {
        if (data.response.status === 0 && this.minFessVersion <= data.response.version) {
          this.FessView.suggestor(this.viewState);
        }
      }, data => { // eslint-disable-line
        // do nothing
      });
    }

    if (history.state != null) {
      FessJQuery('.fessWrapper form input.query').val(history.state.params.q);
      this._search(history.state.params, true);
    } else if (this.urlParams.q !== undefined && this.urlParams.q.length > 0) {
      const query = this.urlParams.q[0];
      if (FessJQuery('.fessWrapper form input.query').length > 0) {
        FessJQuery('.fessWrapper form input.query').val(query);
      }
      try {
        this._search({q: query});
      } catch (e) {
        console.log(e);
      }
    }

    if (this.urlParams.fssVersion !== undefined) {
      this._showVersion();
    }

    window.addEventListener(
      "popstate",
      event => {
        if (event.state != null) {
          this._renderResult(event.state.response, event.state.params);
          this._afterSearch(event.state.response, event.state.params);
          FessJQuery('.fessWrapper form input.query').val(event.state.params.q);
        } else {
          if (this.viewState.popupMode) {
            this.FessView.hideOverlay();
            FessJQuery('.fessOverlay').empty();
          } else {
            FessJQuery('.fessWrapper .fessResult').empty();
          }
          FessJQuery('.fessWrapper form input.query').val('');
        }
      }
    );
  }

  _initViewState(state, conf) {
    state.contextPath     = this.fessUrl.slice(0, this.fessUrl.indexOf('/json'));
    state.apiVersion      = null;
    state.minFessVersion  = this.minFessVersion;
    state.searchPagePath  = FessJQuery('script#fess-ss').attr('fess-search-page-path');
    state.searchParams    = null;
    state.searchResponse  = null;
    state.enableOrder     = this._convert('enable-order',      conf.enableOrder,     true );
    state.enableAllOrders = this._convert('enable-all-orders', conf.enableAllOrder,  false);
    state.enableLabels    = this._convert('enable-labels',     conf.enableLabels,    false);
    state.enableLabelTabs = this._convert('enable-label-tabs', conf.enableLabelTabs, false);
    state.enableThumbnail = this._convert('enable-thumbnail',  conf.enableThumbnail, true );
    state.enableDetails   = this._convert('enable-details',    conf.enableDetails,   false);
    state.enableRelated   = FessJQuery('script#fess-ss').attr('enable-related') === 'true' ? true : false;
    state.linkTarget      = FessJQuery('script#fess-ss').attr('link-target');
    state.enableSuggest   = FessJQuery('script#fess-ss').attr('enable-suggest') === 'true' ? true : false;
    state.popupMode       = FessJQuery('script#fess-ss').attr('popup-result') === 'true' ? true : false;
    state.labels          = null;
    state.fessLang        = this.fessLang || null;
  }

  _convert(attr, conf, def) {
    switch (FessJQuery('script#fess-ss').attr(attr)) {
    case 'true':  return true;
    case 'false': return false;
    default:      return (conf !== undefined ? conf : def);
    }
  }

  _bindForm() {
    const $cls = this;
    FessJQuery('.fessWrapper .fessForm form').submit(function(){
      try {
        const keyword = FessJQuery('input.query', this).val();
        FessJQuery('.fessWrapper form input.query').val(keyword);
        $cls._search({});
      } catch (e) {
        console.log(e);
      }
      return false;
    });
  }

  _bindPagination(response) {
    const $cls = this;
    FessJQuery('.fessWrapper .pagination li').click(function(){
      const $this = FessJQuery(this);
      if ($this.hasClass('disabled')) {
        return false;
      }

      const page = $this.attr('page');
      const params = {};
      params.start = response.page_size * (page - 1);
      if (FessJQuery('.fessWrapper .label-tab-box').length > 0) {
        params['fields.label'] = FessJQuery('.fessWrapper .label-tab-selected').attr('value');
      }
      $cls._search(params);
      if (!$cls.viewState.popupMode) {
        const off = FessJQuery('.fessResultBox').offset();
        FessJQuery(window).scrollTop(off.top);
      }
      return false;
    });
  }

  _bindPopupClose() {
    const $cls = this;
    FessJQuery('.fessOverlay, .fessPopupClose').click(function(){
      $cls.FessView.hideOverlay();
    });
    FessJQuery('.fessOverlay .fessPopup').click(function(e){
      e.stopPropagation();
    });
  }

  _bindSearchOptions() {
    const $cls = this;
    FessJQuery(".fessWrapper select.sort, .fessWrapper select.field-labels").change(function(){
      $cls._search({});
    });
    if (this.viewState.enableLabelTabs) {
      FessJQuery(".fessWrapper .label-tab").click(function(){
        $cls._search({'fields.label': FessJQuery(this).attr('value')});
      });
    }
  }

  _search(params, replace = false) {
    const sort = FessJQuery(".fessWrapper select.sort").val();
    if (params.sort === undefined && sort !== undefined && sort !== '_default_') {
      params.sort = sort;
    }
    const label = FessJQuery(".fessWrapper select.field-labels").val();
    if (params['fields.label'] === undefined && label !== undefined && label !== '_default_') {
      params['fields.label'] = label;
    }
    const pageSize = FessJQuery('script#fess-ss').attr('page-size');
    if (pageSize !== undefined && pageSize !== '') {
      params.num = pageSize;
    }

    for (var key in this.anyParams) {
      params[key] = this.anyParams[key];
    }

    params.lang = this.FessView.getLanguage(this.viewState);

    if (params.q === undefined) {
      let keyword = '';
      if (FessJQuery('.fessWrapper .fessForm').length > 0) {
        keyword = FessJQuery('.fessWrapper .fessForm form input.query').val();
      } else if(FessJQuery('.fessWrapper .fessFormOnly').length > 0) {
        keyword = FessJQuery('.fessWrapper .fessFormOnly form input.query').val();
      } else if(this.urlParams.q !== undefined){
        keyword = this.urlParams.q[0];
      }
      params.q = keyword;

      if (typeof ga == 'function') {
        let u = '/' + window.location.pathname + '?q=' + encodeURIComponent(params.q);
        if (params.start) {
          u = u + '&start=' + params.start;
        }
        if (params.num) {
          u = u + '&num=' + params.num;
        }
        if (params.sort) {
          u = u + '&sort=' + params.sort;
        }
        if (label) {
          u = u + '&fields.label=' + label;
        }
        ga('send', 'pageview', u); // eslint-disable-line
      }
    }
    if (this._isIgnoreQuery(params.q)) {
      return;
    }

    this.viewState.searchParams = params;

    this.FessView.displaySearchWaiting();
    if (this.viewState.popupMode) {
      this.FessView.showOverlay();
    }
    this.FessModel.search(this.fessUrl, params).then(data => {
      let searchResponse = data.response;
      this.viewState.apiVersion = searchResponse.version;
      if (searchResponse.status === 0 && this.minFessVersion <= searchResponse.version) {
        if ((this.viewState.enableLabels || this.viewState.enableLabelTabs) && this.viewState.labels === null) {
          this.FessModel.getLabels(this.fessUrl).then(data => {
            this.viewState.labels = data.response.result;
            this._renderResult(searchResponse, params);
            this._afterSearch(searchResponse, params);
            this._registerHistory(searchResponse, params, replace);
          }, data => {
            console.log("labels error: " + JSON.stringify(data));
            this._renderResult(searchResponse, params);
            this._afterSearch(searchResponse, params);
            this._registerHistory(searchResponse, params, replace);
          });
        } else {
          this._renderResult(searchResponse, params);
          this._afterSearch(searchResponse, params);
          this._registerHistory(searchResponse, params, replace);
        }
      } else {
        searchResponse = {record_count: 0, exec_time: 0, q: params.q};
        searchResponse.warning = (data.response.status !== 0) ? 'error.fess_unavailable' : 'error.fess_unsupported_version';
        this._renderResult(searchResponse, params);
        this._afterSearch(searchResponse, params);
        this._registerHistory(searchResponse, params, replace);
      }
    }, data => { // eslint-disable-line
      const searchResponse = {record_count: 0, exec_time: 0, q: params.q};
      searchResponse.warning = 'error.fess_not_found';
      this._renderResult(searchResponse, params);
      this._afterSearch(searchResponse, params);
      this._registerHistory(searchResponse, params, replace);
    });
  }

  _isIgnoreQuery(keyword) {
    if (keyword === undefined || keyword.length == 0) {
      return true;
    }
    /* eslint no-irregular-whitespace: ["error", {"skipRegExps": true}] */
    const regex = new RegExp(/^[ 　]+$/);
    return regex.test(keyword);
  }

  _renderResult(response, params) {
    if (response.related_query !== undefined) {
      for (let i=0;i<response.related_query.length;i++) {
        const relatedQuery = response.related_query[i];
        response.related_query[i] = {"query": relatedQuery, "link": this._getRelatedQueryLink(relatedQuery)};
      }
    }

    this.viewState.searchResponse = response;
    this.viewState.searchParams = params;

    try {
      if (this.viewState.popupMode) {
        this.FessView.showOverlay();
      }
      this.FessView.render(this.viewState);
    } catch(e) {
      console.log(e);
    }
  }

  _afterSearch(response, params) { // eslint-disable-line
    this._bindPagination(response);
    this._bindSearchOptions();
    if (this.viewState.popupMode) {
      this._bindPopupClose();
    }
    this.FessView.hideSearchWaiting();
  }

  _registerHistory(response, params, replace) {
    if (window.history && window.history.pushState) {
      if (replace) {
        history.replaceState({response: response, params: params}, null);
      } else {
        history.pushState({response: response, params: params}, null);
      }
    }
  }

  _getParameters() {
    let hash = '';
    let url = location.href;
    if (url.indexOf('#') != -1) {
      const array = url.split('#');
      url = array[0];
      hash = array[1];
    }

    const params = (url => {
      const params = {};
      if (url.indexOf('?') != -1) {
        const array = url.split('?');
        const paramArray = array[1].split('&');
        paramArray.forEach((val, index, ar) => { // eslint-disable-line no-unused-vars
          const tpl = val.split('=');
          const key = decodeURIComponent(tpl[0]);
          let value = '';
          if (tpl.length > 1) {
            value = decodeURIComponent(tpl[1].replace(new RegExp("\\+", 'g'), '%20'));
          }

          if (params[key] === undefined) {
            params[key] = [value];
          } else {
            params[key].push(value);
          }
        });
      }
      return params;
    })(url);

    params['fess_url_hash'] = hash;
    return params;
  }

  _getRelatedQueryLink(query) {
    let url = location.href.replace(/\?.*$/, '') + '?q=' + encodeURIComponent(query);
    const hash = this.urlParams['fess_url_hash'];
    Object.keys(this.urlParams).forEach(function(key) {
      if (key !== 'q' && key !== 'fess_url_hash') {
        this[key].forEach(function(val) {
          url = url + '&' + encodeURIComponent(key) + '=' + encodeURIComponent(val);
        });
      }
    }, this.urlParams);
    if (hash !== undefined && hash !== '') {
      url = url + '#' + hash;
    }
    return url;
  }

  _showVersion() {
    console.log('fss:' + require('../../package.json').version + ' fess:' + this.fessVersion);
  }
}
