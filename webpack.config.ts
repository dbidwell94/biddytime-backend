import { Configuration } from "webpack";
import path from "path";

export default function config(env: { WEBPACK_BUNDLE: boolean; WEBPACK_BUILD: boolean }, args: any): Configuration {
  return {
    mode: process.env.NODE_ENV === "development" ? "development" : "production",
    entry: path.join(__dirname, "src", "index.ts"),
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          use: "ts-loader",
        },
      ],
    },
  };
}
