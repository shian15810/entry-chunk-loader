/**
 * @author Eoin Hennessy
 * @author Erik Desjardins
 * See LICENSE file in root directory for full license.
 */

'use strict';

var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
var utils = require('loader-utils');
var webpack = require('webpack');

module.exports = function() {
	// ...
};

module.exports.pitch = function(request) {
	var callback = this.async();

	var query = utils.parseQuery(this.query);

	// create a child compiler (hacky)
	var compiler = this._compilation.createChildCompiler('entry', { filename: query.name });

	// add a dependency on the entry point of the child compiler, so watch mode works
	this.addDependency(request);
	compiler.apply(new SingleEntryPlugin(this.context, '!!' + request, utils.interpolateName(this, '[name]', {})));

	// avoid emitting files with errors, which breaks the parent compiler
	compiler.apply(new webpack.NoErrorsPlugin());

	compiler.runAsChild(function(error, entries) {
		if (error) {
			callback(error);
		} else if (entries[0]) {
			var url = entries[0].files[0];
			callback(null, 'module.exports = __webpack_public_path__ + ' + JSON.stringify(url) + ';');
		} else {
			callback(null, null);
		}
	});
};
