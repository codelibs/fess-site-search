const path = require('path');
const webpack = require("webpack");

module.exports = {
  entry: path.join(__dirname, "/fess/src/main/assemblies/extension/fess-ss/src/main.js"),
  output: {
    path:path.join(__dirname, '/out'),
    filename: 'fess-ss.min.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query:
        {
          presets: ['es2015','stage-0']
        }
      }
    ]
  }
};
