const { defineConfig } = require('@vue/cli-service')
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
  },
  /*
  css: {
    loaderOptions: {
      scss: {
        additionalData:
          `@use "@/assets/scss/fss-bootstrap.scss";
          @use "@/assets/scss/fss-style.scss";
          @use "@/assets/scss/fss.scss";`
      }
    },
  },
  */
})
