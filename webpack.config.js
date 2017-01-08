const path = require("path");
const glob = require("glob");

module.exports = {
  entry: glob.sync("./src/functions/*.ts").reduce(function(acc, item) {
    const obj = {};
    obj[path.basename(item, ".ts")] = item;
    return Object.assign(acc, obj);
  }, {}),

  target:  "node",
  devtool: "source-map",

  module: {
    loaders: [
      {
        test:   /\.tsx?$/,
        loader: "ts-loader",
      },

      {
        test:   /\.json$/,
        loader: "json-loader",
      },
    ],
  },

  resolve: {
    extensions: [
      ".ts",
      ".js",
      ".tsx",
      ".jsx",
      "",
    ],
  },

  output: {
    libraryTarget: "commonjs",
    path:          path.join(__dirname, ".build"),
    filename:      "[name].js",
  },
};
