/**
 * @author Eoin Hennessy
 * @author Erik Desjardins
 * See LICENSE file in root directory for full license.
 */

'use strict';

var path = require('path');
var loaderUtils = require('loader-utils');
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
	new SingleEntryPlugin(
		this.context,
		'!!' + (inert ? fileLoaderPath + '?' + JSON.stringify({ name: partiallyInterpolatedName }) + '!' : '') + request,
		loaderUtils.interpolateName(this, '[name]', {}) // name of the chunk (in logs), not a filename
	).apply(compiler);

	// like compiler.runAsChild(), but remaps paths if necessary
	// https://github.com/webpack/webpack/blob/f6e366b4be1cfe2770251a890d93081824789209/lib/Compiler.js#L206
	compiler.compile(function(err, compilation) {
		if (err) return callback(err);

		// for non-inert entry points, the first file in the first chunk of the first (should only be one) entry point is the real file
		// see https://github.com/webpack/webpack/blob/f6e366b4be1cfe2770251a890d93081824789209/lib/Compiler.js#L215
		var outputFilename = compilation.entrypoints.values().next().value.chunks[0].files[0];

		this.parentCompilation.children.push(compilation);
		for (const name of Object.keys(compilation.assets)) {
			if (inert && name === placeholder) continue;
			if (inert) outputFilename = name; // for inert entry points, last non-placeholder asset is the real file
			this.parentCompilation.assets[path.join(outputDir, name)] = compilation.assets[name];
		}

		callback(null, 'module.exports = __webpack_public_path__ + ' + JSON.stringify(path.join(outputDir, outputFilename)) + ';')
	}.bind(compiler));
};
