import '!style-loader!css-loader!sass-loader!./current/css/style-base.scss';
import '!style-loader!css-loader!sass-loader!./current/css/style.scss';
import '!style-loader!css-loader!sass-loader!./current/css/ss.scss';

import FessMessages from './current/fess-messages.js';
import FessView from './current/view.js';
import FessController from './current/controller.js';
import FessModel from './current/model.js';

//12.7
import FessMessages_12_7 from './12.7/fess-messages.js';
import FessView_12_7 from './12.7/view.js';
import FessController_12_7 from './12.7/controller.js';
import FessModel_12_7 from './12.7/model.js';

import FessJQuery from 'jquery';

const FESS_DEFAULT_VERSION = '13.2';

if (process.env.INPUT_CSS_PATH !== undefined) {
  require('!style-loader!css-loader!' + process.env.INPUT_CSS_PATH);
}

if (process.env.INPUT_JSON_PATH !== undefined) {
  var fessConfig = require('json-loader!' + process.env.INPUT_JSON_PATH);
}

(function() {
  let startFSS = (fessVersion) => {
    let version = parseFloat(fessVersion);  
    let fessController = null;
    if (version >= 13.0) {
      const fessMessages = new FessMessages();
      const fessView = new FessView(fessMessages);
      const fessModel = new FessModel();
      fessController = new FessController(fessView, fessModel, fessVersion);
    } else {
      const fessMessages = new FessMessages_12_7();
      const fessView = new FessView_12_7(fessMessages);
      const fessModel = new FessModel_12_7();
      fessController = new FessController_12_7(fessView, fessModel, fessVersion);
    }
    fessController.start(fessConfig);
  };

  let checkByJsonp = url => {
    FessJQuery.ajax({
      url: url,
      type: "GET",
      dataType: "jsonp"
    }).done(data => {
      if (data.response === undefined || data.response.version === undefined) {
        console.log('Use default version:' + FESS_DEFAULT_VERSION);
        startFSS(FESS_DEFAULT_VERSION);
      } else {
        startFSS(data.response.version);
      }    
    }).fail(data => {
      console.log('Failed to get version. ' + data);
      console.log('Use default version:' + FESS_DEFAULT_VERSION);
      startFSS(FESS_DEFAULT_VERSION);
    });
  };

  let checkByJson = url => {
    FessJQuery.ajax({
      crossDomain: false,
      url: url,
      type: "GET",
      dataType: "json"
    }).done(data => {
      if (data.response === undefined || data.response.version === undefined) {
        console.log('Use default version:' + FESS_DEFAULT_VERSION);
        startFSS(FESS_DEFAULT_VERSION);
      } else {
        startFSS(data.response.version);
      }    
    }).fail(() => {
      checkByJsonp(url);
    });
  };

  let url = FessJQuery('script#fess-ss').attr('fess-url');
  let ver = FessJQuery('script#fess-ss').attr('fess-version');
  let jsonp = FessJQuery('script#fess-ss').attr('jsonp') === 'true' ? true : false;
  if (ver !== undefined) {
    startFSS(ver);
  } else if (jsonp) {
    checkByJsonp(url);
  } else {
    checkByJson(url);
  }
})();
