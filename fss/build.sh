#!/bin/sh

cd `dirname $0`

npm install --save webpack copy-webpack-plugin extract-text-webpack-plugin
npm install --save webpack-cli webpack-dev-server
npm install --save vue
npm install --save vue-js-modal
npm install --save vue-loader vue-template-compiler css-loader style-loader
npm install --save core-js regenerator-runtime
npm install --save @babel/core @babel/preset-env babel-loader
npm install --save json-loader
npm install --save css-loader style-loader sass-loader node-sass
npm install --save axios
npm install --save eslint eslint-loader eslint-plugin-vue

if [ x"$OUTPUT_JS_FILENAME" = "x" ] ; then
  export OUTPUT_JS_FILENAME=fess-ss.min.js
fi
node_modules/.bin/webpack
