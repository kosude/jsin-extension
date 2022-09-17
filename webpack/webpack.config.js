const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
    // determine manifest file to copy into dist
    // this is depending on the selected browser (environment variable)
    let manifestUrl = `./extension/${env.browser}.json`

    return {
        mode: "production",
        entry: {
            index: path.resolve(__dirname, "./index.js"),
        },
        output: {
            path: path.join(__dirname, `../dist/${env.browser}`),
            filename: "[name].js",
        },
        resolve: {
            extensions: ["*", ".ts", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/,
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
                    { from: "./resources/", to: "." },              // resources, e.g. icons and images
                    { from: "./pages/", to: "." },                  // HTML web pages,
                    { from: manifestUrl, to: "./manifest.json" }    // extension manifest file
                ]
            }),
            new MiniCssExtractPlugin()
        ],
    }
};
