import { Configuration } from "webpack";
import path from "path";
import PathsPlugin from "tsconfig-paths-webpack-plugin";

export default function config(env: { WEBPACK_BUNDLE: boolean; WEBPACK_BUILD: boolean }, args: any): Configuration {
  return {
    mode: process.env.NODE_ENV === "development" ? "development" : "production",
    entry: path.join(__dirname, "src", "index.ts"),
    stats: {
      errorDetails: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|js|json)$/,
          use: "ts-loader",
        },
      ],
    },
    resolve: {
      plugins: [new PathsPlugin({ logLevel: "INFO" })],
      extensions: [".ts", ".js", ".json"],
    },
  };
}
