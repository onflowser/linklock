import typescript from "@rollup/plugin-typescript";
import { string } from "rollup-plugin-string";

export default {
  input: "index.ts",
  output: {
    file: "dist/index.ts",
    format: "cjs",
  },
  plugins: [
    typescript(),
    string({
      // Required to be specified
      include: "**/*.cdc",
    }),
  ],
};
