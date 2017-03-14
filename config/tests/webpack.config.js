'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('../../paths');
const nodeExternals = require('webpack-node-externals');

const testDirs = [
  paths.integrationAuthTests,
  paths.integrationTokenTests,
  paths.integrationResourceTests,
  paths.integrationUserTests,
  paths.unitAccessTokenRepositoryTest,
  paths.unitAuthValidationServiceTest,
  paths.unitResourceValidationServiceTest
];

let targetObject = {};

testDirs.map((testDir) => {
  fs.readdirSync(testDir).map((filename) => {
    // src/tests/ と同じ階層構造でアウトプットしたいのでentryのキー名を階層構造で設定する
    const outputDir = testDir.substr(testDir.indexOf('tests') + 6);
    const keyName  = outputDir + '/' + path.basename(filename, '.test.ts');
    const filePath = testDir + '/' + filename;

    targetObject[keyName] = filePath;
  });
});

module.exports = {
  entry: targetObject,
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
    path: paths.testsBuild,
    filename: '[name].test.js',
  },
};
