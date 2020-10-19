const path = require('path');
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, "src/index.js"),
  output: {
    //path: path.join(__dirname, '../instance/generates'),
    path: path.join(__dirname, './dest'),
    filename: process.env.OUTPUT_JS_FILENAME
  },
  devServer: {
    // webpackの扱わないファイル(HTMLや画像など)が入っているディレクトリ
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
        test: /\.vue$/, // ファイルが.vueで終われば...
        loader: 'vue-loader' // vue-loaderを使う
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'] // css-loader -> vue-style-loaderの順で通していく
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", 'css-loader', 'sass-loader']
      },
    ]
  },
  resolve: {
    // import './foo.vue' の代わりに import './foo' と書けるようになる(拡張子省略)
    extensions: ['.js', '.vue'],
    alias: {
      // vue-template-compilerに読ませてコンパイルするために必要
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
