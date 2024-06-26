const { defineConfig } = require('@vue/cli-service');
const webpack = require("webpack");

process.env.VUE_APP_INPUT_CSS_PATH = process.env.INPUT_CSS_PATH;
process.env.VUE_APP_INPUT_JSON_PATH = process.env.INPUT_JSON_PATH;
module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: false,
  chainWebpack: config => {
    config.output.filename(process.env.OUTPUT_JS_FILENAME || 'fess-ss.js');
  },
  configureWebpack: config => {
    config.plugins.push(
        new (require('webpack')).DefinePlugin({
          '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false),
        }),
    );

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
