/**
 * @author Eoin Hennessy
 * @author Erik Desjardins
 * See LICENSE file in root directory for full license.
 */

'use strict';

var path = require('path');
var loaderUtils = require('loader-utils');
var webpack = require('webpack');
var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

var fileLoaderPath = require.resolve('file-loader');

module.exports = function() {
	// ...
};

module.exports.pitch = function(request) {
	var callback = this.async();

	var query = loaderUtils.getOptions(this) || {};
	// loaderUtils handles [ext], [name] and some others but does not handle [hash], etc.
	// webpack itself handles everything but [ext]
	var partiallyInterpolatedName = loaderUtils.interpolateName(this, query.name || '[name].[ext]', {});
	var outputDir = query.path || '.';
	var inert = query.inert || false;

	// output placeholder for `inert`
	var placeholder = '__SPAWN_LOADER_' + String(Math.random()).slice(2) + '__';

	// create a child compiler (hacky)
	var compiler = this._compilation.createChildCompiler(
		loaderUtils.interpolateName(this, '[name]', {}), // name of the compiler (in logs)
		{ filename: inert ? placeholder : partiallyInterpolatedName }
	);

	// add a dependency on the entry point of the child compiler, so watch mode works
	this.addDependency(request);
	compiler.apply(new SingleEntryPlugin(
		this.context,
		'!!' + (inert ? fileLoaderPath + '?' + JSON.stringify({ name: partiallyInterpolatedName }) + '!' : '') + request,
		loaderUtils.interpolateName(this, '[name]', {}) // name of the chunk (in logs), not a filename
	));

	// avoid emitting files with errors, which breaks the parent compiler
	compiler.apply(new webpack.NoErrorsPlugin());

	// like compiler.runAsChild(), but remaps paths if necessary
	// https://github.com/webpack/webpack/blob/2095096835caffbbe3472beaffebb9e7a732ade3/lib/Compiler.js#L267
	compiler.compile(function(err, compilation) {
		if (err) return callback(err);

		// for non-inert entry points, the first file in the first chunk of the first (should only be one) entry point is the real file
		// see https://github.com/webpack/webpack/blob/813c47bde92575700937580d58fa691d4b0b8ac2/lib/Compiler.js#L298
		var outputFilename = compilation.entrypoints[Object.keys(compilation.entrypoints)[0]].chunks[0].files[0];

		this.parentCompilation.children.push(compilation);
		Object.keys(compilation.assets).forEach(function(name) {
			if (inert && name === placeholder) return;
			if (inert) outputFilename = name; // for inert entry points, last non-placeholder asset is the real file
			this.parentCompilation.assets[path.join(outputDir, name)] = compilation.assets[name];
		}.bind(this));

		callback(null, 'module.exports = __webpack_public_path__ + ' + JSON.stringify(path.join(outputDir, outputFilename)) + ';')
	}.bind(compiler));
};
