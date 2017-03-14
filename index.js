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
	var outputFilename = loaderUtils.interpolateName(this, query.name || '[name].[ext]', {});
	var outputDir = query.path || '.';
	var inert = query.inert || false;

	// output placeholder for `inert`
	var placeholder = '__SPAWN_LOADER_' + String(Math.random()).slice(2) + '__';

	// create a child compiler (hacky)
	var compiler = this._compilation.createChildCompiler('entry', { filename: inert ? placeholder : outputFilename });

	// add a dependency on the entry point of the child compiler, so watch mode works
	this.addDependency(request);
	compiler.apply(new SingleEntryPlugin(
		this.context,
		'!!' + (inert ? fileLoaderPath + '?' + JSON.stringify({ name: outputFilename }) + '!' : '') + request,
		loaderUtils.interpolateName(this, '[name]', {}) // name of the chunk (in logs), not a filename
	));

	// avoid emitting files with errors, which breaks the parent compiler
	compiler.apply(new webpack.NoErrorsPlugin());

	// like compiler.runAsChild(), but remaps paths if necessary
	// https://github.com/webpack/webpack/blob/2095096835caffbbe3472beaffebb9e7a732ade3/lib/Compiler.js#L267
	compiler.compile(function(err, compilation) {
		if (err) return callback(err);

		this.parentCompilation.children.push(compilation);
		Object.keys(compilation.assets).forEach(function(name) {
			if (inert && name === placeholder) return;
			this.parentCompilation.assets[path.join(outputDir, name)] = compilation.assets[name];
		}.bind(this));

		callback(null, 'module.exports = __webpack_public_path__ + ' + JSON.stringify(path.join(outputDir, outputFilename)) + ';')
	}.bind(compiler));
};
