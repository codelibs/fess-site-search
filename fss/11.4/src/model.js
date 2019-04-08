import FessJQuery from 'jquery';

export default class {
  constructor() {
  }

  search(url, params) {
    return new Promise((resolve, reject) => {
      FessJQuery.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        data: params
      }).done(data => {
        resolve(data);
      }).fail(data => {
        reject(data);
      });
    });
  }

  getLabels(url) {
    return new Promise((resolve, reject) =>  {
      FessJQuery.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        data: {type: 'label'}
      }).done(data => {
        resolve(data);
      }).fail(data => {
        reject(data);
      });
    });
  }

  getStatus(url) {
    return new Promise((resolve, reject) => {
      FessJQuery.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        data: {type: 'ping'}
      }).done(data => {
        resolve(data);
      }).fail(data => {
        reject(data);
      });
    });
  }
}
