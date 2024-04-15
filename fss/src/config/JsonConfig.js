/**
 * JsonConfig.js
 * 
 * This module provides json config values.
 */

class JsonConfig {

  constructor() {
    if (process.env.VUE_APP_INPUT_JSON_PATH !== undefined && process.env.VUE_APP_INPUT_JSON_PATH !== 'undefined') {
      console.group('[FSS] Load generated configs...');
      this.config = require(process.env.VUE_APP_INPUT_JSON_PATH);
      console.log(this.config);
      console.groupEnd();
    } else {
      // default
      this.config = {};
    }
  }

  enableLabels(defaultVal) {
    return this.config.enableLabels !== undefined ? this.config.enableLabels : defaultVal;
  }

  enableLabelTabs(defaultVal) {
    return this.config.enableLabelTabs !== undefined ? this.config.enableLabelTabs : defaultVal;
  }

  enableOrder(defaultVal) {
    return this.config.enableOrder !== undefined ? this.config.enableOrder : defaultVal;
  }

  enableAllOrders(defaultVal) {
    return this.config.enableAllOrders !== undefined ? this.config.enableAllOrders : defaultVal;
  }

  enableThumbnail(defaultVal) {
    return this.config.enableThumbnail !== undefined ? this.config.enableThumbnail : defaultVal;
  }

  enableDetails(defaultVal) {
    return this.config.enableDetails !== undefined ? this.config.enableDetails : defaultVal;
  }
}

const instance = new JsonConfig();
export default instance;