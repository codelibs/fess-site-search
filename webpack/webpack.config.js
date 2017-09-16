const path = require('path');
const webpack = require("webpack");

module.exports = {
  entry: path.join(__dirname, "main.js"),
  output: {
    path:path.join(__dirname, '../instance/generates'),
    filename: process.env.OUTPUT_JS_FILENAME
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.EnvironmentPlugin(['INPUT_CSS_PATH', 'OUTPUT_JS_FILENAME'])
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
