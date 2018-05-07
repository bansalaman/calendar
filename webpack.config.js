const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common');
const config = {
  entry: {
    // index: __dirname + '/src/flux/index.js',
    // different entry for each page, see e.g. below
    //login: './client/source/scripts/login-page.js',
    // calendar: './src/calendar.2.js',
    calender: './src/calender-view.js',
  },
  output: {
    path: __dirname + '/public',
    filename: './scripts/[name].js' // template based on keys in entry above (index.js & admin.js)
  },
  devtool: 'source-map',
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      },
      { // regular css files
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?importLoaders=1',
          fallback: 'style-loader'
        }),
      },
      {
        test:   /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use:  [{
          loader:   'file-loader',
          options:  {
            name:   '[name].[ext]',
            outputPath:   'assets/fonts/',
              // where the fonts will go
            publicPath:   '../assets/fonts'  // override the default path
          }
        }]
      },
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
            loader: 'css-loader', // translates CSS into CommonJS modules
            }, {
            loader: 'postcss-loader', // Run post css actions
            options: {
                plugins: function () { // post css plugins, can be exported to postcss.config.js
                return [
                    require('precss'),
                    require('autoprefixer')
                ];
                }
            }
            }, {
            loader: 'sass-loader' // compiles Sass to CSS
            }]
        }),
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/images',
            publicPath: '../assets/images'
          }
        }]
      },
      {
        test: /\.(otf|ttf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/fonts',
            publicPath: '../assets/fonts'
          }
        }]
      },
      {
        test: /\.html$/,
        use: [{
          loader: "html-loader",
          options: {
            minimize: false
          }
        }]
      }
    //   {
    //     enforce: "pre",
    //     test: /\.js$/,
    //     exclude: /node_modules/,
    //     loader: 'eslint-loader'
    //   },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery", // Used for Bootstrap JavaScript components
      jQuery: "jquery", // Used for Bootstrap JavaScript components
      Popper: ['popper.js', 'default'] // Used for Bootstrap dropdown, popup and tooltip JavaScript components
    }),
    // output extracted CSS to a file
    new ExtractTextPlugin({
      filename: './styles/[name].css'
    }),
    commonsPlugin,
    new HtmlWebPackPlugin({
      template: "./public/calendar.html",
      chunks: ['common','calender'],
      // chunksSortMode:'none',
      filename: "calendar.html"
    })
  ]
};

module.exports = config;