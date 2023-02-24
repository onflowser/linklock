module.exports = {
  reactStrictMode: true,
  transpilePackages: ["client"],
  compiler: {
    styledComponents: true,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.cdc/,
      use: "raw-loader",
    });
    return config;
  },
};
