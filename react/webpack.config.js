const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: '/usr/src/dex/html/js/dex.js',
  output: {
    path: path.resolve('/usr/src/dex/html/', 'js'),
    filename: 'bundle.js',
  },
  mode: 'production',
  resolve: {
    extensions: [".js", ".jsx"],
    fallback: {
      fs: require.resolve('browserify-fs'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      zlib: require.resolve('browserify-zlib'),
      web3: require.resolve('web3'),
      'bignumber.js': require.resolve('bignumber.js'),
      qs: require.resolve('qs'),
    },
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
  plugins: [
		new NodePolyfillPlugin()
	],
  module: {
          rules: [
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                  cacheCompression: false,
                  envName: "production"
                }
              }
            }
          ]
  },
};
