#!/bin/sh

cd `dirname $0`

npm install --save webpack
npm install --save babel-core babel-loader babel-preset-es2015 babel-preset-stage-0 babel-polyfill
npm install --save json-loader
npm install --save css-loader style-loader sass-loader node-sass extract-text-webpack-plugin
npm install --save jquery
npm install --save handlebars handlebars-loader

if [ x"$OUTPUT_JS_FILENAME" = "x" ] ; then
  export OUTPUT_JS_FILENAME=fess-ss.min.js
fi
node_modules/.bin/webpack
