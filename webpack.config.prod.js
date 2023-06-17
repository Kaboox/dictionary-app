const path = require("path");
const CleanPlugin = require('clean-webpack-plugin')

module.exports = {
	mode: "production",
	entry: "./src/app.ts",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist")
    
	},
	devtool: false,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.scss$/i,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
		],
	},
	// ...
    plugins: [
        new CleanPlugin.CleanWebpackPlugin()
    ]
};
