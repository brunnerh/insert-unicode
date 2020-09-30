import type { Configuration } from 'webpack';
const sveltePreprocess = require('svelte-preprocess');

const path = require('path');

module.exports = (env: any, argv: Configuration) => <Configuration>{
	entry: {
		view: ['./view.js'],
	},
	resolve: {
		alias: {
			svelte: path.resolve(__dirname, '..', '..', '..', 'node_modules', 'svelte')
		},
		extensions: ['.svelte', '.ts', '.tsx', '.mjs', '.js', '.jsx', '.css'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
	},
	output: {
		path: __dirname + '/../../../out/commands/manage-favorites',
		filename: '[name].js',
		chunkFilename: '[name].[id].js',
	},
	devtool: argv.mode === 'production' ? false : 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.svelte$/i,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true,
						preprocess: sveltePreprocess(),
					},
				},
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					'css-loader',
				],
			},
			{
				include: /\.ts$/i,
				loader: 'ts-loader',
			},
			{
				test: /\.svg$/i,
				loader: 'raw-loader',
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
				},
			},
		],
	},
};