import 'babel-polyfill';
import '!style-loader!css-loader!sass-loader!./src/css/style-base.scss';
import '!style-loader!css-loader!sass-loader!./src/css/style.scss';
import '!style-loader!css-loader!sass-loader!./src/css/ss.scss';
import FessMessages from './src/fess-messages.js';
import FessView from './src/view.js';
import FessController from './src/controller.js';
import FessModel from './src/model.js';

require('!style-loader!css-loader!' + process.env.INPUT_CSS_PATH);

(function() {
  var fessMessages = new FessMessages();
  var fessView = new FessView(fessMessages);
  var fessModel = new FessModel();
  var fessController = new FessController(fessView, fessModel);
  fessController.start();
})();
