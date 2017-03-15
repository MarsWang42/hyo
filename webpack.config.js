var webpack = require('webpack');
var path = require('path');

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var env = process.env.WEBPACK_ENV;

var libraryName = 'hyo';
var outputFile = '';
var plugins = [], outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true, output: {comments: false} }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

var BUILD_DIR = path.resolve(__dirname, 'build');
var SRC_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: SRC_DIR + '/index',
  output: {
    path: BUILD_DIR,
    filename: outputFile,
    library: ['hyo'],
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  module : {
    loaders : [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel-loader',
      },
      {
        test: /.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
        include: SRC_DIR,
      },
    ]
  },
  externals: {
    "react": {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
    },
    "classnames": "classnames",
  },
  plugins: plugins,
};

module.exports = config;
