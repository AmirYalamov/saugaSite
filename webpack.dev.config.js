
const polyfil = require('@babel/polyfill')

const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

// EventSource Poly's
// import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill'

// const EventSource = NativeEventSource || EventSourcePolyfill
// OR: may also need to set as global property
// global.EventSource =  NativeEventSource || EventSourcePolyfill

module.exports = {
  entry: {
    main: ['@babel/polyfill', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=5000', './src/index.js']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
          failOnError: false,
          failOnWarning: false,
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'entry'
              }
            ]
          ]
        }
      },
      {
        test: /\.(js|jsx|es6)$/,
        exclude: [/node_modules/],
        include: [/node_modules\/is-valid-domain/, /src/],
        loader: 'babel-loader'
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
            // options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
        // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/html/index.html',
      filename: './index.html',
      excludeChunks: ['server']
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/public/img', to: 'img' }
      ]
    })
  ]
}
