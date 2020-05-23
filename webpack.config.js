const path = require('path');
const UglifyJsPlugin = require('terser-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
require('core-js/stable');

const DEV = 'development';
const ENV = process.env.NODE_ENV ? process.env.NODE_ENV : DEV;

//---------------------------------------------------------------
// Config
//---------------------------------------------------------------

const config = {
  entries: [
    'main',
  ],
  paths: {
    scriptSrc: 'src/scripts/',
    scriptDist: 'dist/scripts/',
    scriptPublic: 'dist/scripts/',
  },
};

//---------------------------------------------------------------
// Plugins
//---------------------------------------------------------------

let plugins = [

];

// Development plugins
if (ENV === DEV) {
  plugins = plugins.concat([
    new ErrorOverlayPlugin(),
  ]);
}


//---------------------------------------------------------------
// Webpack Config
//---------------------------------------------------------------

const webpackConfig = {
  mode: ENV,

  entry: config.entries.reduce(function(result, name) {
    result[name] = path.resolve('./' + config.paths.scriptSrc + name);
    return result;
  }, {}),

  output: {
    path: path.resolve('./' + config.paths.scriptDist),
    filename: '[name].bundle.js',
    publicPath: config.paths.scriptPublic,
    chunkFilename: '[name].bundle.js',
  },

  resolve: {
    modules: [
      path.resolve('./node_modules'),
      path.resolve('./' + config.paths.scriptSrc + 'vendor'),
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: [/node_modules/],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(glsl|frag|vert)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader',
        ],
      },
    ],
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
      },
    },
  },

  plugins: plugins,

  devServer: {
    contentBase: '.',
    host: '0.0.0.0',
    port: 8082,
    disableHostCheck: true,
  },
};

module.exports = webpackConfig;
