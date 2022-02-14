const path = require('path');
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')

const output_file_name = process.env.OUTPUT_JS_FILENAME !== undefined ? process.env.OUTPUT_JS_FILENAME : 'fess-ss.min.js'

module.exports = {
  entry: path.join(__dirname, "src/index.js"),
  output: {
    path: path.join(__dirname, './dest'),
    filename: output_file_name
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'static')
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", 'css-loader', 'sass-loader']
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './static', to: path.resolve(__dirname, "./dest")}
      ],
    }),
    new webpack.EnvironmentPlugin(['INPUT_JSON_PATH', 'INPUT_CSS_PATH', 'OUTPUT_JS_FILENAME'])
  ]
};
