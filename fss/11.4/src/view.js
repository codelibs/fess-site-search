import FessJQuery from 'jquery';
import formTemplate from '!handlebars-loader!./templates/fess-form.hbs';
import formOnlyTemplate from '!handlebars-loader!./templates/fess-form-only.hbs';
import resultTemplate from '!handlebars-loader!./templates/fess-result.hbs';
import noResultTemplate from '!handlebars-loader!./templates/fess-no-result.hbs';
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
      state.searchPagePath = null;
      state.searchParams = null;
      state.searchResponse = null;
      state.enableOrder = false;
      state.enableLabels = false;
      state.enableRelated = false;
      state.enableThumbnail = false;
      state.linkTarget = null;
      state.enableSuggest = false;
      state.popupMode = false;
      state.labels = null;
      return state;
    })();
  }

  render(state) {
    if (FessJQuery('.fessWrapper .fessForm form').length == 0 &&
        FessJQuery('.fessWrapper .fessFormOnly form').length == 0) {
      this._renderForm(state);
    }

    if (state.searchResponse !== null) {
      if (state.popupMode) {
        this._renderPopupResult(state);
      } else {
        this._renderResult(state);
      }
      FessJQuery('.fessWrapper .fessResult').css('display', 'block');
    }
  }

  _renderForm(state) {
    var $fessForm = FessJQuery('.fessWrapper .fessForm');
    var $fessFormOnly = FessJQuery('.fessWrapper .fessFormOnly');
    if ($fessForm.length > 0) {
      var html = formTemplate();
      $fessForm.html(this.FessMessages.render(html, {}));
    }
    if ($fessFormOnly.length > 0) {
      var html = formOnlyTemplate();
      $fessFormOnly.html(this.FessMessages.render(html, {}));
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

    if(state.enableSuggest) {
      this._suggestor(state);
    }
  }

  _renderResult(state) {
    var response = state.searchResponse;
    response['context_path'] = state.contextPath;
    response['labels'] = state.labels;
    if (state.enableLabels && state.labels !== null) {
      response['labels'] = state.labels;
    }

    if (!state.enableRelated) {
      delete response.related_query;
      delete response.related_contents;
    }
    response['has_results'] = response.record_count > 0;

    if (state.linkTarget) {
      response['link_target'] = state.linkTarget;
    }

    var $fessResult = FessJQuery('.fessWrapper .fessResult');
    var html = resultTemplate(response);
    $fessResult.html(this.FessMessages.render(html, response));
    if (response.record_count > 0) {
      var $pagination = this._createPagination(response.record_count, response.page_size, response.page_number, state.searchParams);
      FessJQuery('.fessWrapper .paginationNav').append($pagination);
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
    response['labels'] = state.labels;
    if (state.enableLabels && state.labels !== null) {
      response['labels'] = state.labels;
    }

    if (!state.enableRelated) {
      delete response.related_query;
      delete response.related_content;
    }
    response['has_results'] = response.record_count > 0;

    if (state.linkTarget) {
      response['link_target'] = state.linkTarget;
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
    $popupResultSection.html(this.FessMessages.render(html, response));
    $popup.append($popupResultSection);

    var $fessOverlay = FessJQuery('.fessOverlay');
    $fessOverlay.html('');
    $fessOverlay.append($popup);
    if (response.record_count > 0) {
      var $pagination = this._createPagination(response.record_count, response.page_size, response.page_number, state.searchParams);
      FessJQuery('.fessWrapper .paginationNav').append($pagination);
      if (state.enableThumbnail) {
        this._loadThumbnail(state.contextPath);
      } else {
        FessJQuery('.fessWrapper .thumbnailBox').css('display', 'none');
      }
    }
    this._setSearchOptions(state);
  }

  _setSearchOptions(state) {
    if (state.enableOrder) {
      FessJQuery('.fessWrapper .fessResultBox table .order').css('display', 'block');
      if (state.searchParams.sort !== undefined) {
        FessJQuery('.fessWrapper select.sort').val(state.searchParams.sort);
      }
    } else {
      FessJQuery('.fessWrapper .fessResultBox table .order').css('display', 'none');
    }

    if (state.enableLabels) {
      FessJQuery('.fessWrapper .fessResultBox table .labels').css('display', 'block');
      if (state.searchParams['fields.label'] !== undefined){
        FessJQuery('.fessWrapper select.field-labels').val(state.searchParams['fields.label']);
      }
    } else {
      FessJQuery('.fessWrapper .fessResultBox table .labels').css('display', 'none');
    }
  }

  _createPagination(recordCount, pageSize, currentPage, params) {
    var $cls = this;

    var $pagination = FessJQuery('<ul/>');
    $pagination.addClass('pagination');

    var calc_start_pos = function(page, pageSize) {
      return (pageSize * (page - 1));
    }

    var paginationInfo = (function(){
      var pageWidth = function() {
        var width;
        if (window.matchMedia('( max-width : 47.9em)').matches) {
          width = 2;
        } else {
          width = 5;
        }
        return width;
      }();
      var allPageNum = Math.floor((recordCount - 1) / pageSize) + 1;
      var info = {};
      info.current = currentPage;
      info.min = (currentPage - pageWidth) > 0 ? currentPage - pageWidth : 1;
      info.max = (currentPage + pageWidth) < allPageNum ? currentPage + pageWidth : allPageNum;
      return info;
    })();

    var $prev = (function(){
      var $li = FessJQuery('<li/>');
      $li.addClass('prev');
      $li.attr('aria-label', 'Previous');
      $li.attr('page', paginationInfo.current - 1);
      $li.html($cls.FessMessages.render('<a><span aria-hidden="true">&laquo;</span> <span class="sr-only">{result.pagination.prev}</span></a>', {}));
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

    var $next = (function(){
      var $li = FessJQuery('<li/>');
      $li.addClass('next');
      $li.attr('aria-label', 'Next');
      $li.attr('page', paginationInfo.current + 1);
      $li.html($cls.FessMessages.render('<a><span class="sr-only">{result.pagination.next}</span><span aria-hidden="true">&raquo;</span></a>', {}));
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
    var $cls = this;
    var loadImage = function(img, url, limit) {
      var imgData = new Image();
      imgData.onload = function() {
        var $img = FessJQuery(img);
        $img.parent().parent().css('display', '');
        $img.css('background-image', '');
        $img.attr('src', url);
      };
      imgData.onerror = function() {
        if (limit > 0) {
          setTimeout(function() {
            loadImage(img, url, --limit);
          }, $cls.IMG_LOADING_DELAY);
        }
        imgData = null;
      };
      imgData.src = url;
    };

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

  _suggestor(state) {
    FessJQuery('.fessWrapper form input.query').suggestor(
      {
        ajaxinfo : {
          url : state.contextPath + '/suggest',
          fn : '_default,content,title',
          num : 10,
          lang : this.FessMessages.getLanguage()
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
      });
    }
}
