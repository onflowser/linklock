module.exports = {
  entry: "./index.js",
  module: {
    rules: [
      {
        test: /\.cdc$/i,
        use: "raw-loader",
      },
    ],
  },
};
