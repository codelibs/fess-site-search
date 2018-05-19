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
      },
      cs: {
        'form.search.button': 'Hledat',
        'form.input.placeholder': '',
        'result.number': '',
        'result.second': 's',
        'result.label': 'Štítku',
        'result.label.all': 'Vše',
        'result.order': 'Objednat',
        'result.order.score': 'Relevance',
        'result.order.last_modified': 'Data',
        'result.pagination.prev': 'Předchozí',
        'result.pagination.next': 'Další',
        'result.did_not_match': 'Na váš předmět vyhledávání - <b>{{q}}</b> - nebyl nalezen žádný odkaz.',
        'result.related_query_label': 'Související Dotaz:'
      },
      da: {
        'form.search.button': 'Søg',
        'form.input.placeholder': '',
        'result.number': 'resultater',
        'result.second': 'sekunder',
        'result.label': 'Etiket',
        'result.label.all': 'Alle',
        'result.order': 'Ordren',
        'result.order.score': 'Relevans',
        'result.order.last_modified': 'Dato',
        'result.pagination.prev': 'Forrige',
        'result.pagination.next': 'Næste',
        'result.did_not_match': 'Din søgning - <b>{{q}}</b> - matchede ikke nogen dokumenter.',
        'result.related_query_label': 'Relateret Forespørgsel:'
      },
      de: {
        'form.search.button': 'Suche',
        'form.input.placeholder': '',
        'result.number': 'Ergebnisse',
        'result.second': 'Sekunden',
        'result.label': 'Labels',
        'result.label.all': 'Alle',
        'result.order': 'Bestellung',
        'result.order.score': 'Relevanz',
        'result.order.last_modified': 'Datum',
        'result.pagination.prev': 'Zurück',
        'result.pagination.next': 'Weiter',
        'result.did_not_match': 'Es wurden keine mit deiner Suchanfrage - <b>{{q}}</b> - übereinstimmenden Dokumente gefunden.',
        'result.related_query_label': 'Verwandte Abfrage:'
      },
      es: {
        'form.search.button': 'Buscar',
        'form.input.placeholder': '',
        'result.number': 'resultados',
        'result.second': 'segundos',
        'result.label': 'Etiquetas',
        'result.label.all': 'Todo',
        'result.order': 'Orden',
        'result.order.score': 'Importancia',
        'result.order.last_modified': 'Fecha',
        'result.pagination.prev': 'Anterior',
        'result.pagination.next': 'Siguiente',
        'result.did_not_match': 'La búsqueda de <b>{{q}}</b> no obtuvo ningún resultado.',
        'result.related_query_label': 'Consulta relacionada:'
      },
      fr: {
        'form.search.button': 'Rechercher',
        'form.input.placeholder': '',
        'result.number': 'résultats',
        'result.second': 'secondes',
        'result.label': 'Libellés',
        'result.label.all': 'Tous',
        'result.order': 'Ordine',
        'result.order.score': 'Pertinence',
        'result.order.last_modified': 'Date',
        'result.pagination.prev': 'Précédent',
        'result.pagination.next': 'Suivant',
        'result.did_not_match': 'Aucun document ne correspond aux termes de recherche spécifiés (<b>{{q}}</b>)',
        'result.related_query_label': 'Requête associée:'
      },
      it: {
        'form.search.button': 'Cerca',
        'form.input.placeholder': '',
        'result.number': 'risultati',
        'result.second': 'secondi',
        'result.label': 'Etichette',
        'result.label.all': 'Tutti',
        'result.order': 'Ordina',
        'result.order.score': 'Rilevanza',
        'result.order.last_modified': 'Data',
        'result.pagination.prev': 'Indietro',
        'result.pagination.next': 'Avanti',
        'result.did_not_match': 'La ricerca di - <b>{{q}}</b> - non ha prodotto risultati in nessun documento.',
        'result.related_query_label': 'Query correlata:'
      },
      hu: {
        'form.search.button': 'Keresés',
        'form.input.placeholder': '',
        'result.number': 'találat',
        'result.second': 'másodperc',
        'result.label': 'Címke',
        'result.label.all': 'Összes',
        'result.order': 'Rendelés',
        'result.order.score': 'Relevancia',
        'result.order.last_modified': 'Dátum',
        'result.pagination.prev': 'Előző',
        'result.pagination.next': 'Következő',
        'result.did_not_match': 'A keresett kifejezés (<b>{{q}}</b>) egyetlen dokumentumban sem található meg.',
        'result.related_query_label': 'Kapcsolódó lekérdezés:'
      },
      nl: {
        'form.search.button': 'Zoeken',
        'form.input.placeholder': '',
        'result.number': 'resultaten',
        'result.second': 'seconden',
        'result.label': 'Labels',
        'result.label.all': 'Alle',
        'result.order': 'Bestelling',
        'result.order.score': 'Relevantie',
        'result.order.last_modified': 'Datum',
        'result.pagination.prev': 'Vorige',
        'result.pagination.next': 'Volgende',
        'result.did_not_match': 'Je zoekbewerking - <b>{{q}}</b> - heeft geen overeenkomstige documenten opgeleverd.',
        'result.related_query_label': 'Gerelateerde zoekopdracht:'
      },
      no: {
        'form.search.button': 'Søk',
        'form.input.placeholder': '',
        'result.number': 'resultater',
        'result.second': 'sekunder',
        'result.label': 'Etiketter',
        'result.label.all': 'Alle',
        'result.order': 'Bestill',
        'result.order.score': 'Relevans',
        'result.order.last_modified': 'Dato',
        'result.pagination.prev': 'Forrige',
        'result.pagination.next': 'Neste',
        'result.did_not_match': 'Ingen dokumenter samsvarte med søket ditt på «<b>{{q}}</b>».',
        'result.related_query_label': 'Relatert spørsmål:'
      },
      pl: {
        'form.search.button': 'Szukaj',
        'form.input.placeholder': '',
        'result.number': 'wyników',
        'result.second': 's',
        'result.label': 'Etykiety',
        'result.label.all': 'Wszystko',
        'result.order': 'Zamówienie',
        'result.order.score': 'Trafności',
        'result.order.last_modified': 'Daty',
        'result.pagination.prev': 'Poprzednia',
        'result.pagination.next': 'Następna',
        'result.did_not_match': 'Podana fraza - <b>{{q}}</b> - nie została odnaleziona.',
        'result.related_query_label': 'Podobne zapytanie:'
      },
      pt: {
        'form.search.button': 'Pesquisar',
        'form.input.placeholder': '',
        'result.number': 'resultados',
        'result.second': 'segundos',
        'result.label': 'Marcador',
        'result.label.all': 'Todas',
        'result.order': 'Ordem',
        'result.order.score': 'Relevância',
        'result.order.last_modified': 'Data',
        'result.pagination.prev': 'Anterior',
        'result.pagination.next': 'Mais',
        'result.did_not_match': 'Sua pesquisa - <b>{{q}}</b> - não encontrou nenhum documento correspondente.',
        'result.related_query_label': 'Consulta Relacionada:'
      },
      fi: {
        'form.search.button': 'Haku',
        'form.input.placeholder': '',
        'result.number': 'tuloksesta',
        'result.second': 'sekuntia',
        'result.label': 'Tunniste',
        'result.label.all': 'Kaikki',
        'result.order': 'Järjestys',
        'result.order.score': 'Vastaavuuden',
        'result.order.last_modified': 'Päivämäärän',
        'result.pagination.prev': 'Edellinen',
        'result.pagination.next': 'Seuraava',
        'result.did_not_match': 'Hakusi - <b>{{q}}</b> - ei vastaa yhtään sivua.',
        'result.related_query_label': 'Vastaava kysely:'
      },
      sv: {
        'form.search.button': 'Sök',
        'form.input.placeholder': '',
        'result.number': 'resultat',
        'result.second': 'sekunder',
        'result.label': 'Etikett',
        'result.label.all': 'Allt',
        'result.order': 'Beställa',
        'result.order.score': 'Relevans',
        'result.order.last_modified': 'Datum',
        'result.pagination.prev': 'Föregående',
        'result.pagination.next': 'Nästa',
        'result.did_not_match': 'Din sökning - <b>{{q}}</b> - matchade inte något dokument.',
        'result.related_query_label': 'Relaterad sökning:'
      },
      tr: {
        'form.search.button': 'Ara',
        'form.input.placeholder': '',
        'result.number': 'sonuç',
        'result.second': 'saniye',
        'result.label': 'Etiket\'i',
        'result.label.all': 'Tümü',
        'result.order': 'Sipariş',
        'result.order.score': 'Alaka',
        'result.order.last_modified': 'Tarihe',
        'result.pagination.prev': 'Önceki',
        'result.pagination.next': 'Sonraki',
        'result.did_not_match': 'Aradığınız - <b>{{q}}</b> - ile ilgili hiçbir arama sonucu mevcut değil.',
        'result.related_query_label': 'Ilgili Sorgu:'
      },
      ru: {
        'form.search.button': 'Поиск',
        'form.input.placeholder': '',
        'result.number': 'страница',
        'result.second': 'сек.',
        'result.label': 'Ярлыки',
        'result.label.all': 'Все',
        'result.order': 'Заказ',
        'result.order.score': 'Релевантность',
        'result.order.last_modified': 'Дате',
        'result.pagination.prev': 'Предыдущая',
        'result.pagination.next': 'Следующая',
        'result.did_not_match': 'По запросу <b>{{q}}</b> ничего не найдено.',
        'result.related_query_label': 'Связанный запрос:'
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
