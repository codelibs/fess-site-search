/**
 * JsonConfig.js
 *
 * This module provides json config values.
 */

class JsonConfig {

  constructor() {
    // __FSS_JSON_CONFIG__ is embedded at Vite build time
    const config = typeof __FSS_JSON_CONFIG__ !== 'undefined' ? __FSS_JSON_CONFIG__ : {};
    if (Object.keys(config).length > 0) {
      console.group('[FSS] Load generated configs...');
      console.log(config);
      console.groupEnd();
    }
    this.config = config;
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
