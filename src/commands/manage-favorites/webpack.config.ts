import { Configuration } from 'webpack';
const path = require('path');

module.exports = (env: any, argv: Configuration) => <Configuration>{
	entry: {
		view: ['./view.js'],
	},
	resolve: {
		alias: {
			svelte: path.resolve(__dirname, '..', '..', '..', 'node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte', '.ts'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
	},
	output: {
		path: __dirname + '/../../../out/commands/manage-favorites',
		filename: '[name].js',
		chunkFilename: '[name].[id].js',
	},
	devtool: argv.mode === 'production' ? false : 'source-map',
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true,
					},
				},
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				],
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader',
			},
		],
	},
};