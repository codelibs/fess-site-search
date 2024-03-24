const { defineConfig } = require('@vue/cli-service');
const webpack = require("webpack");

process.env.VUE_APP_INPUT_CSS_PATH = process.env.INPUT_CSS_PATH;
module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: false,
  chainWebpack: config => {
    config.output.filename(process.env.OUTPUT_JS_FILENAME || 'fess-ss.js');
  },
  configureWebpack: config => {
    config.optimization = {
      splitChunks: false
    };
    
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    config.resolve.fallback.querystring = require.resolve('querystring-es3');
  }
});
