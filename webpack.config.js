const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		app: './src/script.js'
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'dist.script.js'
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
		},
		{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['env']
			}
		}]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]
	
}