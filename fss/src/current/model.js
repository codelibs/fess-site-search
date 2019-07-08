import FessJQuery from 'jquery';

export default class {
  constructor() {
  }

  search(url, params) {
    return new Promise((resolve, reject) => {
      FessJQuery.ajax({
        crossDomain: false,
        url: url,
        type: "GET",
        dataType: "json",
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
        crossDomain: false,
        url: url,
        type: "GET",
        dataType: "json",
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
        crossDomain: false,
        url: url,
        type: "GET",
        dataType: "json",
        data: {type: 'ping'}
      }).done(data => {
        resolve(data);
      }).fail(data => {
        reject(data);
      });
    });
  }
}
