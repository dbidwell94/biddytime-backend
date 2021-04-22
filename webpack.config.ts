import { Configuration } from "webpack";
import path from "path";
import PathsPlugin from "tsconfig-paths-webpack-plugin";
import externals from "webpack-node-externals";
import glob from "glob";
import nodemonPlugin from "nodemon-webpack-plugin";

const migrationFiles = glob.sync("./migrations/*.ts").reduce((acc, p) => {
  const fileName = p.replace(/^.*[\\\/]/, "");
  acc[fileName.replace(".ts", "")] = path.join(__dirname, p);
  return acc;
}, {} as Record<string, string>);

const migrationFileNames = Object.keys(migrationFiles);

export default function config(env: { WEBPACK_BUNDLE: boolean; WEBPACK_BUILD: boolean }, args: any): Configuration {
  return {
    mode: process.env.NODE_ENV === "development" ? "development" : "production",
    entry: {
      index: path.join(__dirname, "src", "index.ts"),
      ...migrationFiles,
    },
    target: "node",
    externals: [externals()],
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
    plugins: [new nodemonPlugin()],
    resolve: {
      plugins: [new PathsPlugin()],
      extensions: [".ts", ".js", ".json"],
    },
    output: {
      filename: (path) => {
        if (migrationFileNames.includes(path.chunk?.name || "")) {
          return `/migrations/${path.chunk?.name || ""}.js`;
        }
        return path.chunk?.name ? path.chunk.name + ".js" : ".js";
      },
    },
  };
}
