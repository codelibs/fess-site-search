import FessJQuery from 'jquery';
import formTemplate from '!handlebars-loader!./templates/fess-form.hbs';
import formOnlyTemplate from '!handlebars-loader!./templates/fess-form-only.hbs';
import resultTemplate from '!handlebars-loader!./templates/fess-result.hbs';
import noResultTemplate from '!handlebars-loader!./templates/fess-no-result.hbs';
import warningTemplate from '!handlebars-loader!./templates/fess-warning.hbs';
import './suggestor.js';

export default class {
  constructor(FessMessages) {
    this.FessMessages = FessMessages;
    this.IMG_LOADING_DELAY = 200;
    this.IMG_LOADING_MAX = 0;
    this.defaultBodyOverflow = FessJQuery('body').css('overflow');
  }

  init() {
    {
      var $fessWrapper = FessJQuery('<div/>');
      $fessWrapper.addClass('fessWrapper');
      FessJQuery('fess\\:search').replaceWith($fessWrapper);

      var $fessForm = FessJQuery('<div/>');
      $fessForm.addClass('fessForm');
      $fessWrapper.append($fessForm);

      var $fessResult = FessJQuery('<div/>');
      $fessResult.addClass('fessResult');
      //$fessResult.css('display', 'none');
      $fessWrapper.append($fessResult);
    }

    {
      var $fessFormWrapper = FessJQuery('<div/>');
      $fessFormWrapper.addClass('fessWrapper');

      var $fessFormOnly = FessJQuery('<div/>');
      $fessFormOnly.addClass('fessFormOnly');
      $fessFormWrapper.append($fessFormOnly);

      FessJQuery('fess\\:search-form-only').replaceWith($fessFormWrapper);
    }

    {
      var $fessResultWrapper = FessJQuery('<div/>');
      $fessResultWrapper.addClass('fessWrapper');

      var $fessResultOnly = FessJQuery('<div/>');
      $fessResultOnly.addClass('fessResult');
      //$fessResultOnly.css('display', 'none');
      $fessResultWrapper.append($fessResultOnly);

      FessJQuery('fess\\:search-result-only').replaceWith($fessResultWrapper);
    }
  }

  newState() {
    return (() => {
      var state = {};
      state.contextPath = '';
      state.apiVersion = null;
      state.minFessVersion = null;
      state.searchPagePath = null;
      state.searchParams = null;
      state.searchResponse = null;
      state.enableOrder = false;
      state.enableAllOrders = false;
      state.enableLabels = false;
      state.enableLabelTabs = false;
      state.enableRelated = false;
      state.enableThumbnail = false;
      state.linkTarget = null;
      state.enableSuggest = false;
      state.popupMode = false;
      state.labels = null;
      state.fessLang = null;
      state.enableDetails = false;
      return state;
    })();
  }

  render(state) {
    if (FessJQuery('.fessWrapper .fessForm form').length == 0 &&
        FessJQuery('.fessWrapper .fessFormOnly form').length == 0) {
      this._renderForm(state);
    }

    if (state.searchResponse !== null) {
      if (state.searchResponse.warning !== undefined) {
        this._renderWarningPage(state);
      } else if (state.popupMode) {
        this._renderPopupResult(state);
      } else {
        this._renderResult(state);
      }
      FessJQuery('.fessWrapper .fessResult').css('display', 'block');
    }
  }

  _renderWarningPage(state) {
    var html = warningTemplate({ 'warning': '{' + state.searchResponse.warning + '}' });
    if (state.popupMode) {
      var $popup = FessJQuery('<div/>');
      $popup.addClass('fessPopup');

      var $popupHeader = FessJQuery('<div/>');
      var $popupCloseButton = FessJQuery('<button/>');
      $popupCloseButton.attr('type', 'button');
      $popupCloseButton.addClass('close');
      $popupCloseButton.addClass('fessPopupClose');
      $popupCloseButton.html('&times;');
      $popupHeader.append($popupCloseButton);
      $popup.append($popupHeader);

      var $popupResultSection = FessJQuery('<div/>');
      $popupResultSection.addClass('fessPopupResult');
      $popupResultSection.html(this.FessMessages.render(html, state, state.fessLang));
      $popup.append($popupResultSection);

      var $fessOverlay = FessJQuery('.fessOverlay');
      $fessOverlay.html('');
      $fessOverlay.append($popup);
    } else {
      var $fessResult = FessJQuery('.fessWrapper .fessResult');
      $fessResult.html(this.FessMessages.render(html, state, state.fessLang));
    }
  }

  _renderForm(state) {
    var $fessForm = FessJQuery('.fessWrapper .fessForm');
    var $fessFormOnly = FessJQuery('.fessWrapper .fessFormOnly');
    if ($fessForm.length > 0) {
      var html = formTemplate();
      $fessForm.html(this.FessMessages.render(html, {}, state.fessLang));
    }
    if ($fessFormOnly.length > 0) {
      var html = formOnlyTemplate();
      $fessFormOnly.html(this.FessMessages.render(html, {}, state.fessLang));
      FessJQuery('.fessWrapper .fessFormOnly form').attr('action', state.searchPagePath);
    }
    if (state.searchParams !== null && state.searchParams.q !== undefined) {
      if (FessJQuery('.fessWrapper .fessForm form input.query').length > 0) {
        FessJQuery('.fessWrapper .fessForm form input.query').val(state.searchParams.q);
      }
      if (FessJQuery('.fessWrapper .fessFormOnly form input.query').length > 0) {
        FessJQuery('.fessWrapper .fessFormOnly form input.query').val(state.searchParams.q);
      }
    }
  }

  _renderResult(state) {
    var response = state.searchResponse;
    response['context_path'] = state.contextPath;
    response['labels'] = null;
    response['label_tabs'] = null;
    if (state.enableLabels && state.labels !== null) {
      response['labels'] = state.labels;
    }
    if (state.enableLabelTabs && state.labels !== null) {
      response['label_tabs'] = state.labels;
    }

    if (!state.enableRelated) {
      delete response.related_query;
      delete response.related_contents;
    }

    if (state.enableAllOrders) {
      response['all_orders'] = true;
    }

    response['has_results'] = response.record_count > 0;

    if (state.linkTarget) {
      response['link_target'] = state.linkTarget;
    }

    if (response['has_results']) {
      var lang = this.getLanguage(state);
      for (var result of response['result']) {
        result['created'] = this._dateToString(new Date(result['created']), lang);
        if (result['last_modified']) {
          result['last_modified'] = this._dateToString(new Date(result['last_modified']), lang);
        }
      }
      response['dir'] = lang == 'ar' || lang == 'he' ? 'rtl' : 'ltr';
    }

    var $fessResult = FessJQuery('.fessWrapper .fessResult');
    var html = resultTemplate(response);
    $fessResult.html(this.FessMessages.render(html, response, state.fessLang));
    if (response.record_count > 0) {
      var $pagination = this._createPagination(response.record_count, response.page_size, response.page_number, state.searchParams, state.fessLang);
      FessJQuery('.fessWrapper .paginationNav').append($pagination);
      if (!state.enableDetails) {
          FessJQuery('.fessWrapper .info').css('display', 'none');
      }
      if (state.enableThumbnail) {
        this._loadThumbnail(state.contextPath);
      } else {
        FessJQuery('.fessWrapper .thumbnailBox').css('display', 'none');
      }
    }
    this._setSearchOptions(state);
  }

  _renderPopupResult(state) {
    var response = state.searchResponse;
    response['context_path'] = state.contextPath;
    response['labels'] = null;
    response['label_tabs'] = null;
    if (state.enableLabels && state.labels !== null) {
      response['labels'] = state.labels;
    }
    if (state.enableLabelTabs && state.labels !== null) {
      response['label_tabs'] = state.labels;
    }

    if (!state.enableRelated) {
      delete response.related_query;
      delete response.related_contents;
    }

    if (state.enableAllOrders) {
      response['all_orders'] = true;
    }

    response['has_results'] = response.record_count > 0;

    if (state.linkTarget) {
      response['link_target'] = state.linkTarget;
    }

    if (response['has_results']) {
      var lang = this.getLanguage(state);
      for (var result of response['result']) {
        result['created'] = this._dateToString(new Date(result['created']), lang);
        if (result['last_modified']) {
          result['last_modified'] = this._dateToString(new Date(result['last_modified']), lang);
        }
      }
      response['dir'] = lang == 'ar' || lang == 'he' ? 'rtl' : 'ltr';
    }

    var html = resultTemplate(response);
    var $popup = FessJQuery('<div/>');
    $popup.addClass('fessPopup');

    var $popupHeader = FessJQuery('<div/>');
    var $popupCloseButton = FessJQuery('<button/>');
    $popupCloseButton.attr('type', 'button');
    $popupCloseButton.addClass('close');
    $popupCloseButton.addClass('fessPopupClose');
    $popupCloseButton.html('&times;');
    $popupHeader.append($popupCloseButton);
    $popup.append($popupHeader);

    var $popupResultSection = FessJQuery('<div/>');
    $popupResultSection.addClass('fessPopupResult');
    $popupResultSection.html(this.FessMessages.render(html, response, state.fessLang));
    $popup.append($popupResultSection);

    var $fessOverlay = FessJQuery('.fessOverlay');
    $fessOverlay.html('');
    $fessOverlay.append($popup);
    if (response.record_count > 0) {
      var $pagination = this._createPagination(response.record_count, response.page_size, response.page_number, state.searchParams, state.fessLang);
      FessJQuery('.fessWrapper .paginationNav').append($pagination);
      if (!state.enableDetails) {
          FessJQuery('.fessWrapper .info').css('display', 'none');
      }
      if (state.enableThumbnail) {
        this._loadThumbnail(state.contextPath);
      } else {
        FessJQuery('.fessWrapper .thumbnailBox').css('display', 'none');
      }
    }
    this._setSearchOptions(state);
  }

  _dateToString(date, lang) {
      return date.toLocaleDateString(lang) + ' ' + date.toLocaleTimeString(lang);
  }

  _setSearchOptions(state) {
    if (state.enableOrder) {
      FessJQuery('.fessWrapper .fessResultBox table .order-box').css('display', 'table-cell');
      if (state.searchParams.sort !== undefined) {
        FessJQuery('.fessWrapper select.sort').val(state.searchParams.sort);
      }
      FessJQuery('.fessWrapper .fessResultBox table .labels .form-control').removeClass('short');
    } else {
      FessJQuery('.fessWrapper .fessResultBox table .order-box').css('display', 'none');
      FessJQuery('.fessWrapper .fessResultBox table .labels .form-control').addClass('short');
    }

    if (state.enableLabels) {
      FessJQuery('.fessWrapper .fessResultBox table .labels-box').css('display', 'table-cell');
      if (state.searchParams['fields.label'] !== undefined){
        FessJQuery('.fessWrapper select.field-labels').val(state.searchParams['fields.label']);
      }
    } else {
      FessJQuery('.fessWrapper .fessResultBox table .labels-box').css('display', 'none');
    }

    if (state.enableLabelTabs) {
      FessJQuery('.fessWrapper .label-tab').each(function(){
        if((FessJQuery(this).attr('value') === state.searchParams['fields.label']) ||
           (FessJQuery(this).attr('value') === "" && state.searchParams['fields.label'] === undefined)) {
          FessJQuery(this).addClass('label-tab-selected');
        }
      });
    }
  }

  _createPagination(recordCount, pageSize, currentPage, params, fessLang) {
    var $pagination = FessJQuery('<ul/>');
    $pagination.addClass('pagination');

    var calc_start_pos = (page, pageSize) => pageSize * (page - 1);

    var paginationInfo = (() => {
      var pageWidth = (() => {
        var width;
        if (window.matchMedia('( max-width : 47.9em)').matches) {
          width = 2;
        } else {
          width = 5;
        }
        return width;
      })();
      var allPageNum = Math.floor((recordCount - 1) / pageSize) + 1;
      var info = {};
      info.current = currentPage;
      info.min = (currentPage - pageWidth) > 0 ? currentPage - pageWidth : 1;
      info.max = (currentPage + pageWidth) < allPageNum ? currentPage + pageWidth : allPageNum;
      return info;
    })();

    var $prev = (() => {
      var $li = FessJQuery('<li/>');
      $li.addClass('prev');
      $li.attr('aria-label', 'Previous');
      $li.attr('page', paginationInfo.current - 1);
      $li.html(this.FessMessages.render('<a><span aria-hidden="true">&laquo;</span> <span class="sr-only">{result.pagination.prev}</span></a>', {}, fessLang));
      if (currentPage > 1) {
        $li.css('cursor', 'pointer');
      } else {
        $li.addClass('disabled');
      }
      return $li;
    })();
    $pagination.append($prev);

    for (var i=paginationInfo.min;i<=paginationInfo.max;i++) {
      var $li = FessJQuery('<li/>');
      if (i == paginationInfo.current) {
        $li.addClass('active');
      }
      $li.css('cursor', 'pointer');
      $li.html('<a>' + i + '</a>');
      $li.attr('page', i);
      $pagination.append($li);
    }

    var $next = (() => {
      var $li = FessJQuery('<li/>');
      $li.addClass('next');
      $li.attr('aria-label', 'Next');
      $li.attr('page', paginationInfo.current + 1);
      $li.html(this.FessMessages.render('<a><span class="sr-only">{result.pagination.next}</span><span aria-hidden="true">&raquo;</span></a>', {}, fessLang));
      if (paginationInfo.current < paginationInfo.max) {
        $li.css('cursor', 'pointer');
      } else {
        $li.addClass('disabled');
      }
      return $li;
    })();
    $pagination.append($next);

    return $pagination;
  }

  _loadThumbnail(contextPath) {
    var loadImage = (img, url, limit) => {
      var imgData = new Image();
      imgData.onload = () => {
        var $img = FessJQuery(img);
        $img.parent().parent().css('display', '');
        $img.css('background-image', '');
        $img.attr('src', url);
      };
      imgData.onerror = () => {
        if (limit > 0) {
          setTimeout(() => {
            loadImage(img, url, --limit);
          }, this.IMG_LOADING_DELAY);
        }
        imgData = null;
      };
      imgData.src = url;
    };

    var $cls = this;
    FessJQuery('.fessWrapper .fessResultBox img.thumbnail').each(function() {
      FessJQuery(this).css('background-image', 'url("' + contextPath + '/images/loading.gif")');
      FessJQuery(this).parent().parent().css('display', 'none');
      loadImage(this, FessJQuery(this).attr('data-src'), $cls.IMG_LOADING_MAX);
    });
  }

  setupOverlay() {
    var $popupOverlay = FessJQuery('<div/>');
    $popupOverlay.addClass('fessWrapper');
    $popupOverlay.addClass('fessOverlay');
    $popupOverlay.css('display', 'none');
    FessJQuery('body').append($popupOverlay);
  }

  showOverlay() {
    FessJQuery('.fessOverlay').css('display', 'block');
    FessJQuery(window).on('touchmove.noScroll', function(e) {
      e.preventDefault();
    });
    this.defaultBodyOverflow = FessJQuery('body').css('overflow');
    FessJQuery('body').css('overflow', 'hidden');
  }

  hideOverlay() {
    FessJQuery('.fessPopup').css('display', 'none');
    FessJQuery('.fessOverlay').css('display', 'none');
    FessJQuery(window).off('.noScroll');
    FessJQuery('body').css('overflow', this.defaultBodyOverflow);
  }

  displaySearchWaiting() {
    if (FessJQuery('.fessResultBox').length == 0) {
      return;
    }
    var $waiting = FessJQuery('<div/>');
    $waiting.addClass('fessSearchWaiting');
    FessJQuery('.fessResultBox').append($waiting);
  }

  hideSearchWaiting() {
  }

  suggestor(state) {
    FessJQuery('.fessWrapper form input.query').suggestor(
      {
        ajaxinfo : {
          url : state.contextPath + '/suggest',
          fn : '_default,content,title',
          num : 10,
          lang : this.getLanguage(state)
        },
        boxCssInfo : {
          border : '1px solid rgba(82, 168, 236, 0.5)',
          '-webkit-box-shadow' : '0 1px 1px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(82, 168, 236, 0.2)',
          '-moz-box-shadow' : '0 1px 1px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(82, 168, 236, 0.2)',
          'box-shadow' : '0 1px 1px 0px rgba(0, 0, 0, 0.1), 0 3px 2px 0px rgba(82, 168, 236, 0.2)',
          'background-color' : '#fff',
          'z-index' : '10000'
        },
        listSelectedCssInfo : {
          'background-color' : 'rgba(72, 158, 226, 0.1)'
        },
        listDeselectedCssInfo : {
          'background-color' : '#ffffff'
        },
        minturm : 1,
        adjustWidthVal : 0,
        searchForm : FessJQuery('.fessWrapper .fessForm form')
      }
  );
  }

  getLanguage(state) {
    return this.FessMessages.getLanguage(state.fessLang);
  }
}
