import type { Configuration } from 'webpack';
const sveltePreprocess = require('svelte-preprocess');
const path = require('path');

module.exports = (env: any, argv: Configuration) => {
	const isProduction = argv.mode === 'production';

	return <Configuration>{
		entry: {
			'commands/manage-favorites/view': ['../commands/manage-favorites/view.js'],
			'commands/data-table/view': ['../commands/data-table/view.js'],
		},
		resolve: {
			alias: {
				svelte: path.resolve(__dirname, '..', '..', 'node_modules', 'svelte')
			},
			extensions: ['.svelte', '.ts', '.tsx', '.mjs', '.js', '.jsx', '.css'],
			mainFields: ['svelte', 'browser', 'module', 'main'],
		},
		output: {
			path: __dirname + '/../../out',
			filename: '[name].js',
			chunkFilename: isProduction ? '[id].js' : '[name].[id].js',
		},
		devtool: isProduction ? false : 'source-map',
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
};
