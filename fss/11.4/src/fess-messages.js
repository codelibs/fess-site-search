export default class {
  constructor() {
    this.messages = {
      en: {
        'form.search.button': 'Search',
        'form.input.placeholder': '',
        'result.number': 'results',
        'result.second': 'second',
        'result.label': 'Labels',
        'result.label.all': 'All',
        'result.order': 'Order',
        'result.order.score': 'Relevance',
        'result.order.last_modified': 'Last modified',
        'result.pagination.prev': 'prev',
        'result.pagination.next': 'next',
        'result.did_not_match': 'Your search - <b>{{q}}</b> - did not match any documents.',
        'result.related_query_label': 'Related Query:'
      },
      ja: {
        'form.search.button': '検索',
        'form.input.placeholder': '',
        'result.number': '件',
        'result.second': '秒',
        'result.label': 'ラベル',
        'result.label.all': '全て',
        'result.order': '表示順',
        'result.order.score': '関連度',
        'result.order.last_modified': '更新日時',
        'result.pagination.prev': '前へ',
        'result.pagination.next': '次へ',
        'result.did_not_match': '<b>{{q}}</b>に一致する情報は見つかりませんでした。',
        'result.related_query_label': '関連クエリ:'
      },
      zh: {
        'form.search.button': '搜尋',
        'form.input.placeholder': '',
        'result.number': '条结果',
        'result.second': '秒',
        'result.label': '标签',
        'result.label.all': '所有',
        'result.order': '排序',
        'result.order.score': 'Relevance',
        'result.order.last_modified': 'Date',
        'result.pagination.prev': '上一页',
        'result.pagination.next': '下一页',
        'result.did_not_match': '未找到符合 <b>{{q}}</b> 的搜索结果',
        'result.related_query_label': '相关查询:'
      },
      tw: {
        'form.search.button': '搜尋',
        'form.input.placeholder': '',
        'result.number': '条结果',
        'result.second': '秒',
        'result.label': '標籤',
        'result.label.all': '全部',
        'result.order': '排序',
        'result.order.score': 'Relevance',
        'result.order.last_modified': 'Date',
        'result.pagination.prev': '上一页',
        'result.pagination.next': '下一页',
        'result.did_not_match': '找不到符合搜尋字詞 <b>{{q}}</b> 的文件',
        'result.related_query_label': '相關查詢:'
      },
      ko: {
        'form.search.button': '검색',
        'form.input.placeholder': '',
        'result.number': '개',
        'result.second': '초',
        'result.label': '라벨',
        'result.label.all': '전체',
        'result.order': '정렬 기준',
        'result.order.score': 'Relevance',
        'result.order.last_modified': 'Date',
        'result.pagination.prev': '이전',
        'result.pagination.next': '다음',
        'result.did_not_match': '<b>{{q}}</b>와(과) 일치하는 검색결과가 없습니다',
        'result.related_query_label': '관련 검색어:'
      }
    }
  }
  getLanguage() {
    var lang = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.userLanguage || window.navigator.language || window.navigator.browserLanguage  || 'en';
    if (lang.indexOf('-') > 0) {
      if (lang === 'zh-TW') {
        lang = 'tw';
      } else if(lang === 'zh-CN' || lang === 'zh-HK') {
        lang = "zh";
      } else {
        lang = lang.substr(0, lang.indexOf('-'));
      }
    }
    return lang;
  }
  getMessage(key, vars) {
    var language = this.getLanguage();
    if (this.messages[language] === undefined) {
      language = 'en';
    }
    var message = this.messages[language][key];
    if (message === undefined) {
      console.log('Invalid message key:' + key);
      return '';
    }

    for (var key in vars) {
      if (typeof vars[key] == 'string' || typeof vars == 'string') {
        var reg = new RegExp('{{' + key + '}}', 'g');
        message = message.replace(reg, this._escapeHtml(vars[key]));
      }
    }
    //var reg = new RegExp('{{[^{}]*}}', 'g');
    //message = message.replace(reg, '');
    return message;
  }
  render(html, vars) {
    var language = this.getLanguage();
    if (this.messages[language] === undefined) {
      language = 'en';
    }
    var tmpHtml = html;
    var messages = this.messages[language];
    for(var key in messages) {
      var reg = new RegExp('{' + key + '}', 'g');
      tmpHtml = tmpHtml.replace(reg, this.getMessage(key, vars));
    }
    return tmpHtml;
  }

  _escapeHtml (message) {
    if(typeof message !== 'string') {
      return message;
    }
    return message.replace(/[&'`"<>]/g, function(match) {
      return {
        '&': '&amp;',
        "'": '&#x27;',
        '`': '&#x60;',
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;',
      }[match]
    });
  }
}
