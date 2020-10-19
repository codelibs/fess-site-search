import axios from 'axios';

export default class {
  constructor(fessUrl){
    this.fessUrl = fessUrl.endsWith('/') ? fessUrl.substring(0, fessUrl.length - 1): fessUrl;
  }
  
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

  search(searchCond, data) {
    const url = this.fessUrl + '/json';
    const queryParams = {
      q: searchCond.q,
      sort: searchCond.sort,
      'fields.label': searchCond.label,
      num: searchCond.pageSize,
      start: (searchCond.page - 1) * searchCond.pageSize,
    };
    if (queryParams.q === '') {
      queryParams.q = '*:*';
    }

    return new Promise((resolve, reject) =>  {
      axios.get(
        url,
        {
          params: queryParams,
        }
      ).then((res) => {
        try {
          const response = res.data.response;
          data.recordCount = response.record_count;
          data.recordCountRelation = response.record_count_relation;
          data.startRecordNumber = response.start_record_number;
          data.endRecordNumber = response.end_record_number;
          data.execTime = response.exec_time;
          data.relatedQueries = response.related_query;
          data.relatedContents = response.related_contents;
          data.q = response.q;
          data.queryId = response.query_id;
          data.pageInfo.pageNumbers = response.page_numbers;
          data.pageInfo.currentPageNumber = response.page_number;
          data.pageInfo.prevPage = response.prev_page;
          data.pageInfo.nextPage = response.next_page;

          const result = response.result;
          data.items = [];
          result.forEach((item, i) => {
            data.items.push(item);
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

  getLabels() {
    const url = this.fessUrl + '/json';
    const queryParams = {
      type: 'label'
    };
    return new Promise((resolve, reject) =>  {
      axios.get(
        url,
        {
          params: queryParams,
        }
      ).then((res) => {
        const response = res.data.response;
        const labels = [];
        response.result.forEach((label, i) => {
          labels.push(label);
        });
        resolve(labels);
      }).catch((res) => {
        reject(res);
      });
    });
  }
}