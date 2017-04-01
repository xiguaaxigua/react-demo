const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const extractCSS = new ExtractTextPlugin('./bundle.css');

module.exports = {
  devtool: 'cheap-source-map',
  entry: {
    vendor: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-cookie'
    ],
    app: path.resolve(__dirname, 'app/main.js')
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: './bundle.[hash].js'
  },
  module: {
    loaders: [
      {
        include: /fonts\//,
        test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
        loader: "file-loader?name=[name].[ext]&publicPath=assets/icon_fonts/fonts/&outputPath=assets/icon_fonts/fonts/"
      },
      {
        test: /\.(scss|css)$/,
        include: path.resolve(__dirname, 'app'),
        sourceMap: false,
        loader: extractCSS.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.js[x]?$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: 'file-loader?name=[name].[ext]&publicPath=assets/images/&outputPath=assets/images/'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.optimize.DedupePlugin(),
    new uglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin([
      {
        from: './app/index.html', to: 'index.html'
      },
      {
        from: './app/assets/config.js', to: './assets/config.js'
      }
    ]),
    extractCSS
  ]
};
