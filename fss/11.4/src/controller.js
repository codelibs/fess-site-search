import FessJQuery from 'jquery';

export default class {
  constructor(FessView, FessModel) {
    this.FessView = FessView;
    this.FessModel = FessModel;
    this.fessUrl = FessJQuery('script#fess-ss').attr('fess-url');
    this.urlParams = this._getParameters();
    this.viewState = null;
  }

  start() {
    this.FessView.init();
    this.viewState = this.FessView.newState();
    this._initViewState(this.viewState);
    this.FessView.render(this.viewState);
    this._bindForm();
    if (this.viewState.popupMode) {
      this.FessView.setupOverlay();
    }
    if (this.urlParams.q !== undefined && this.urlParams.q.length > 0) {
      var query = this.urlParams.q[0];
      if (FessJQuery('.fessWrapper .fessForm form input').length > 0) {
        FessJQuery('.fessWrapper .fessForm form input').val(query);
      }
      if (FessJQuery('.fessWrapper .fessFormOnly form input').length > 0) {
        FessJQuery('.fessWrapper .fessFormOnly form input').val(query);
      }
      try {
        this._search({q: query});
      } catch (e) {
        console.log(e);
      }
    }
  }

  _initViewState(state) {
    state.contextPath = this.fessUrl.slice(0, this.fessUrl.indexOf('/json'));
    state.searchPagePath = FessJQuery('script#fess-ss').attr('fess-search-page-path');
    state.searchParams = null;
    state.searchResponse = null;
    state.enableOrder = FessJQuery('script#fess-ss').attr('enable-order') === 'false' ? false : true;
    state.enableLabels = FessJQuery('script#fess-ss').attr('enable-labels') === 'true' ? true : false;
    state.enableRelated = FessJQuery('script#fess-ss').attr('enable-related') === 'true' ? true : false;
    state.popupMode = FessJQuery('script#fess-ss').attr('popup-result') === 'true' ? true : false;
    state.labels = null;
  }

  _bindForm() {
    var $cls = this;
    FessJQuery('.fessWrapper .fessForm form').submit(function(){
      try {
        var keyword = FessJQuery('#contentQuery', this).val();
        FessJQuery('.fessWrapper #contentQuery').val(keyword);
        $cls._search({});
      } catch (e) {
        console.log(e);
      }
      return false;
    });
  }

  _bindPagination(response) {
    var $cls = this;
    FessJQuery('.fessWrapper .pagination li').click(function(){
      var $this = FessJQuery(this);
      if ($this.hasClass('disabled')) {
        return false;
      }

      var page = $this.attr('page');
      var params = {};
      params.start = response.page_size * (page - 1);
      $cls._search(params);
      if (!$cls.viewState.popupMode) {
        var off = FessJQuery('.fessResultBox').offset();
        FessJQuery(window).scrollTop(off.top);
      }
      return false;
    });
  }

  _bindPopupClose() {
    var $cls = this;
    FessJQuery('.fessOverlay, .fessPopupClose').click(function(){
      $cls._hideOverlay();
    });
    FessJQuery('.fessOverlay .fessPopup').click(function(e){
      e.stopPropagation();
    })
  }

  _bindSearchOptions() {
    if (FessJQuery('.fessWrapper .fessForm').length == 0 || this.viewState.popupMode) {
      var $cls = this;
      FessJQuery(".fessWrapper select.sort, .fessWrapper select.field-labels").change(function(){
        $cls._search({});
      });
    }
  }

  _search(params) {
    if (params.q === undefined) {
      var keyword = '';
      if (FessJQuery('.fessWrapper .fessForm').length > 0) {
        keyword = FessJQuery('.fessWrapper .fessForm #contentQuery').val();
      } else if(FessJQuery('.fessWrapper .fessFormOnly').length > 0) {
        keyword = FessJQuery('.fessWrapper .fessFormOnly #contentQuery').val();
      } else if(this.urlParams.q !== undefined){
        keyword = this.urlParams.q[0];
      }
      if (keyword.length > 0) {
        params.q = keyword;
      } else {
        params.q = '*:*';
      }
    }

    var sort = FessJQuery(".fessWrapper select.sort").val();
    if (sort !== undefined && sort !== '') {
      params.sort = sort;
    }
    var label = FessJQuery(".fessWrapper select.field-labels").val();
    if (label !== undefined && label !== '') {
      params['fields.label'] = label;
    }

    this.viewState.searchParams = params;

    var $cls = this;
    this.FessView.displaySearchWaiting();
    if (this.viewState.popupMode) {
      this.FessView.showOverlay();
    }
    this.FessModel.search(this.fessUrl, params).then(function(data){
      var searchResponse = data.response;
      if ($cls.viewState.enableLabels && $cls.viewState.labels === null) {
        $cls.FessModel.getLabels($cls.fessUrl).then(function(data) {
          $cls.viewState.labels = data.response.result;
          $cls._renderResult(searchResponse, params);
          $cls._afterSearch(searchResponse, params);
        }, function(data) {
          console.log("labels error: " + JSON.stringify(data));
          $cls._renderResult(searchResponse, params);
          $cls._afterSearch(searchResponse, params);
        });
      } else {
        $cls._renderResult(searchResponse, params);
        $cls._afterSearch(searchResponse, params);
      }
    }, function(data) {
      var searchResponse = {record_count: 0, exec_time: 0, q: params.q};
      console.log("search error: " + JSON.stringify(data));
      $cls._renderResult(searchResponse, params);
      $cls._afterSearch(searchResponse, params);
    });
  }

  _renderResult(response, params) {
    if (response.related_query !== undefined) {
      for (var i=0;i<response.related_query.length;i++) {
        var relatedQuery = response.related_query[i];
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

  _afterSearch(response, params) {
    this._bindPagination(response);
    this._bindSearchOptions();
    if (this.viewState.popupMode) {
      this._bindPopupClose();
    }
    this.FessView.hideSearchWaiting();
  }

  _getParameters() {
    var path = location.href.replace(/\?.*$/, '');
    var hash = '';
    var url = location.href;
    if (url.indexOf('#') != -1) {
      var array = url.split('#');
      url = array[0];
      hash = array[1];
    }

    var params = function(url) {
      var params = {};
      if (url.indexOf('?') != -1) {
        var array = url.split('?');
        var paramArray = array[1].split('&');
        paramArray.forEach(function(val, index, ar) {
          var tpl = val.split('=');
          var key = decodeURIComponent(tpl[0]);
          var value = '';
          if (tpl.length > 1) {
            value = decodeURIComponent(tpl[1]);
          }

          if (params[key] === undefined) {
            params[key] = [value];
          } else {
            params[key].push(value);
          }
        });
      }
      return params;
    }(url);

    params['fess_url_hash'] = hash;
    return params;
  }

  _getRelatedQueryLink(query) {
    var url = location.href.replace(/\?.*$/, '') + '?q=' + encodeURIComponent(query);
    var hash = this.urlParams['fess_url_hash'];
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
}
