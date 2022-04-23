const TerserPlugin = require("terser-webpack-plugin");
const path = require('@babel/core/lib/vendor/import-meta-resolve');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'react-bundle'),
    filename: 'react-bundle.js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  mode: 'production'
};