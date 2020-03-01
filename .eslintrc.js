module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		sourceType: "module"
	},
	plugins: [
		"@typescript-eslint"
	],
	ignorePatterns: ['node_modules/', 'out/'],
	rules: {
		"@typescript-eslint/class-name-casing": "warn",
		"@typescript-eslint/member-delimiter-style": [
			"warn",
			{
				multiline: {
					delimiter: "semi",
					requireLast: true
				},
				singleline: {
					delimiter: "semi",
					requireLast: false
				}
			}
		],
		"@typescript-eslint/semi": [
			"warn",
			"always"
		],
		curly: "off",
		eqeqeq: [
			"warn",
			"always"
		],
		"no-redeclare": "warn",
		"no-throw-literal": "warn",
		"no-unused-expressions": "warn"
	}
};
