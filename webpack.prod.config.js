var webpack = require('webpack')
var path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    bundle: './src/index'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'underscore-template-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
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
}
