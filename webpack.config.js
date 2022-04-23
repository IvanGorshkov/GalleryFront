const TerserPlugin = require("terser-webpack-plugin");
const path = require('@babel/core/lib/vendor/import-meta-resolve');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'react-bundle.js',
  },
  module: {
    rules : [
      { test: /\.js?/, loader: 'bable-loader', exclude: /node_modules/ }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  mode: 'production'
};