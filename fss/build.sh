#!/bin/sh

cd `dirname $0`

npm install --save webpack
npm install --save core-js
npm install --save @babel/core @babel/preset-env babel-loader
npm install --save json-loader
npm install --save css-loader style-loader sass-loader node-sass extract-text-webpack-plugin
npm install --save jquery
npm install --save handlebars handlebars-loader
npm install --save eslint eslint-loader

if [ x"$OUTPUT_JS_FILENAME" = "x" ] ; then
  export OUTPUT_JS_FILENAME=fess-ss.min.js
fi
node_modules/.bin/webpack
