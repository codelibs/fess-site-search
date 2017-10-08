const path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: path.join(__dirname, "./js/main.js"),
  output: {
    path: path.join(__dirname, './app/static'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
  ]
};
