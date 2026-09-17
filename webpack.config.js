import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  mode: "development",
  entry: "./src/main.js",
  output: {
    // Content-hashed so a redeploy actually invalidates the browser's
    // cached copy: an unchanging "main.js" URL meant CSS/behavior changes
    // (all bundled into this one file, injected by style-loader) could
    // silently keep serving a stale cached version after a deploy.
    filename: "main.[contenthash].js",
    path: path.resolve(import.meta.dirname, "docs"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/index.html"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
