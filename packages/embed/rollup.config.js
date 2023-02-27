import ts from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
// TODO: Do we need this
// import peerDepsExternal from "rollup-plugin-peer-deps-external";
import image from "@rollup/plugin-image";

// TODO: We need to config polyfills, but that causes other problems.
//  See: https://github.com/ionic-team/rollup-plugin-node-polyfills/issues/11

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "es",
  },
  plugins: [
    // peerDepsExternal(),
    json(),
    image(),
    resolve(),
    commonjs(),
    ts(),
    postcss(),
    // babel({
    //   presets: ["@babel/preset-react"],
    // }),
  ],
};
