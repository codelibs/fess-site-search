import axios from 'axios';
import ApiClient from '@/openapi/main/ApiClient';
import SearchApi from '@/openapi/main/api/SearchApi';
import SuggestApi from '@/openapi/main/api/SuggestApi';

/**
 * SearchService.js
 * 
 * This module provides search functions.
 */
export default class {
  constructor(fessUrl){
    this.fessUrl = fessUrl.endsWith('/') ? fessUrl.substring(0, fessUrl.length - 1): fessUrl;

    ApiClient.instance.basePath = this.fessUrl + "/api/v1";
    ApiClient.instance.defaultHeaders = {};
  }
  
  /**
   * Get fess version.
   * @returns fessVersion
   */
  getFessVersion() {
    const url = this.fessUrl + '/json';
    return new Promise((resolve, reject) =>  {
      axios.get(
        url
      ).then((res) => {
        const version = res.data.response.version;
        resolve(version);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  /**
   * Search
   * @param {Object} searchCond 
   * @param {Object} state Update by search result.
   * @returns Promise<SearchResponse>
   */
  search(searchCond, state) {
    const searchApi = new SearchApi();
    const queryParams = {
      q: searchCond.q,
      sort: searchCond.sort,
      fieldsLabel: [searchCond.label],
      num: searchCond.pageSize,
      start: (searchCond.page - 1) * searchCond.pageSize,
    };
    if (queryParams.q === '') {
      queryParams.q = '*:*';
    }

    return new Promise((resolve, reject) =>  {
      searchApi.searchDocuments(queryParams).then((response) => {
        try {
          state.recordCount = response.record_count;
          state.recordCountRelation = response.record_count_relation;
          state.startRecordNumber = response.start_record_number;
          state.endRecordNumber = response.end_record_number;
          state.execTime = response.exec_time;
          state.relatedQueries = response.related_query;
          state.relatedContents = response.related_contents;
          state.q = response.q;
          state.queryId = response.query_id;
          state.pageInfo.pageNumbers = response.page_numbers;
          state.pageInfo.currentPageNumber = response.page_number;
          state.pageInfo.prevPage = response.prev_page;
          state.pageInfo.nextPage = response.next_page;

          state.items = [];
          response.data.forEach((item, i) => {
            state.items.push(item);
          });
          resolve(response);
        } catch (e) {
          reject(e);
        }
      }).catch((res) => {
        reject(res);
      });
    });
  }

  /**
   * Get labels
   * @returns List of labels
   */
  getLabels() {
    const searchApi = new SearchApi();
    return new Promise((resolve, reject) =>  {
      searchApi.listLabels().then((response) => {
        const labels = [];
        if (response.record_count > 0) {
          response.data.forEach((label, i) => {
            labels.push(label);
          });
        }
        resolve(labels);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Suggest
   * @param {String} keyword 
   * @param {Number} num 
   * @param {Array<String>} labels 
   * @param {Array<String>} langs 
   * @param {Array<String>} fields 
   * @returns Words list.
   */
  suggest(keyword, num, labels, langs, fields) {
    const suggestApi = new SuggestApi();
    return new Promise((resolve, reject) => {
      const opts = {
        num: num,
        label: labels,
        lang: langs,
        field: fields
      };
      try {
        suggestApi.findSuggestWords(keyword, opts).then((response) => {
          const words = [];
          if (response.record_count > 0) {
            response.data.forEach((word, i) => {
              words.push(word.text);
            });
          }
          resolve(words);
        }).catch((error) => {
          reject(error);
        });
      } catch(e) {
        reject(e);
      }
    });
  }
}