const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: {
        background: path.resolve(__dirname, "index.js"),
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: ["*", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: ".", to: ".", context: "extension" },       // extension file/s (i.e. manifest.json)
                { from: ".", to: ".", context: "resources" },       // resources, e.g. icons and images
                { from: ".", to: ".", context: "pages" },           // HTML web pages
            ]
        }),
        new MiniCssExtractPlugin()
    ],
};
