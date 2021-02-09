const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');

const config = {
  entry: [
    "react-hot-loader/patch",
    "./src/index.js"
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.pcss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars: {
                  hack: `true; @import "${path.resolve(
                    __dirname,
                    "src",
                    "shared",
                    "config",
                    "theme.less",
                  )}";`
                },
                javascriptEnabled: true
              } 
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: "file-loader"
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      ".js",
      ".jsx"
    ],
    alias: {
      "react-dom": "@hot-loader/react-dom",
      "@tidings": path.resolve(__dirname, "src"),
      "@tidings-elements": path.resolve(__dirname, "src/shared/components"),
      "@tidings-modules": path.resolve(__dirname, "src/modules"),
      "@tidings-shared": path.resolve(__dirname, "src/shared"),
    }
  },
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "app",
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
    }),
    new Dotenv(),
    new MiniCssExtractPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
    })
  ],
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  }
};

module.exports = (env, argv) => {
  if (argv.hot) {
    // Cannot use "contenthash" when hot reloading is enabled.
    config.output.filename = "[name].[fullhash].js";
  }

  return config;
};