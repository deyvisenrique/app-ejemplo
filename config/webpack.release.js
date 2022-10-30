const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');

const CordovaHtmlOutputPlugin = require('../webpack/plugins/CordovaHtmlOutputPlugin.js');
const TerserPlugin = require('terser-webpack-plugin');
// const CleanPlugin = require('clean-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = function() {
  return webpackMerge(commonConfig({ mode: 'production' }), {
    module: {
      rules: [
        {
          test: /\.css$/,
          loader: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new CordovaHtmlOutputPlugin(),
      new TerserPlugin({
        extractComments: false
      }),
      new CleanWebpackPlugin({
        dry: false,
        verbose: false,
        cleanOnceBeforeBuildPatterns: ['!index.html'],
        cleanAfterEveryBuildPatterns: ['!index.html']
      })
      // new CleanPlugin('www', {
      //   root: path.join(__dirname, '.'),
      //   dry: false,
      //   verbose: false,
      //   exclude: ['index.html']
      // })
    ]
  });
};
