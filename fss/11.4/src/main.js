import 'babel-polyfill';
import '!style-loader!css-loader!sass-loader!./css/style-base.scss';
import '!style-loader!css-loader!sass-loader!./css/style.scss';
import '!style-loader!css-loader!sass-loader!./css/ss.scss';
import FessMessages from './fess-messages.js';
import FessView from './view.js';
import FessController from './controller.js';
import FessModel from './model.js';

if (process.env.INPUT_CSS_PATH !== undefined) {
  require('!style-loader!css-loader!' + process.env.INPUT_CSS_PATH);
}

if (process.env.INPUT_JSON_PATH !== undefined) {
  var fessConfig = require('json-loader!' + process.env.INPUT_JSON_PATH);
}

(function() {
  const fessMessages = new FessMessages();
  const fessView = new FessView(fessMessages);
  const fessModel = new FessModel();
  const fessController = new FessController(fessView, fessModel);
  fessController.start(fessConfig);
})();
