const fs = require('fs');
const path = require('path');
const paths = require('./paths');
const nodeExternals = require('webpack-node-externals');

const handlers = fs.readdirSync(paths.appFunctions)
  .map(filename => ({
    [path.basename(filename, '.ts')]: path.join(paths.appFunctions, filename),
  }))
  .reduce(
    (finalObject, entry) => Object.assign(finalObject, entry), {}
  );

module.exports = {
  entry: handlers,
  target:  'node',
  externals: [nodeExternals()],
  devtool: 'source-map',

  module: {
    loaders: [
      {
        test:   /\.tsx?$/,
        loader: 'ts-loader',
      },

      {
        test:   /\.json$/,
        loader: 'json-loader',
      },
    ],
  },

  resolve: {
    extensions: [
      '.ts',
      '.js',
      '',
    ],
  },

  output: {
    libraryTarget: 'commonjs',
    path: paths.appBuild,
    filename: '[name].js',
  },
};
