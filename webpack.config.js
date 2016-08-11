
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')

module.exports = {
  target: 'electron',
  entry: [
    './src/index.js',
    './src/index.css',
  ],
  plugins: [
    new ExtractTextPlugin('[name].css', {allChunks: true}),
    new HtmlWebpackPlugin({ template: 'index.html' })
  ],
  module: {
    loaders: [
      { test: /\.js$/, loader: 'buble' },
      { test: /\.svg$/, loader: 'svg-sprite' },
      { test: /\.html$/, loader: 'html' },

      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!postcss-loader'
        )
      },
      {
        test: /\.woff$/,
        loader: 'url-loader',
        query: {
          limit: 50000,
          mimetype: 'application/font-woff',
          name: './[hash].[ext]'
        }
      }
    ]
  },
  postcss: function (webpack) {
    console.log('postcss hook executed')
    return [
      require('postcss-import')({ addDependencyTo: webpack }),
      require('postcss-cssnext')(),
      require('postcss-browser-reporter')(),
      require('postcss-reporter')()
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      '@core': __dirname + '/src'
    }
  },
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  devServer: {
    outputPath: 'dist',
    port: 8080,
    historyApiFallback: {
      index: 'index.html'
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  console.log('prod environment set')
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ])
} else {
  module.exports.devtool = '#source-map'
}