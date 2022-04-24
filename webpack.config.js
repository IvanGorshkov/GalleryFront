const TerserPlugin = require("terser-webpack-plugin");
const path = require('@babel/core/lib/vendor/import-meta-resolve');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'react-bundle.js',
  },
  module: {
    rules : [
      { test: /\.js?/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(sass|css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require("autoprefixer")()
              ],
            },
          },
          'sass-loader',
        ]
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  mode: 'production'
};