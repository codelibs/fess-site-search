const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: false,
  configureWebpack: {
    optimization: {
      splitChunks: false
    },
    output: {
      filename: 'fess-ss.js'
    }
  }
});
