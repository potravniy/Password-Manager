var webpack = require('webpack');
var path = require('path')

module.exports = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'underscore-template-loader'
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      _: 'underscore'
    })
  ],
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    extensions: [".js", ".json"]
  }
};