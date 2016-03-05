import { readFileSync, statSync } from 'fs';
import { join } from 'path';

import test from 'ava';
import webpack from 'webpack';
import rimraf from 'rimraf';

test('basic usage', async t => {
	await new Promise((resolve, reject) => {
		webpack({
			entry: join(__dirname, 'src/main.js'),
			bail: true,
			output: {
				path: join(__dirname, 'dist'),
				filename: 'main.bundle.js'
			},
			module: {
				loaders: [
					{ test: /\.entry\.js$/, loader: join(__dirname, '../index.js'), query: { name: '[name].spawned.js' } }
				]
			}
		}, (err, stats) => {
			err ? reject(err) : resolve(stats);
		});
	});

	t.ok(statSync(join(__dirname, 'dist/main.bundle.js')), 'main bundle exists');
	t.ok(statSync(join(__dirname, 'dist/other.entry.spawned.js')), 'second entry bundle exists');

	t.regex(readFileSync(join(__dirname, 'dist/main.bundle.js')), /"other\.entry\.spawned\.js"/, 'references spawned module');
	t.regex(readFileSync(join(__dirname, 'dist/other.entry.spawned.js')), /\bfunction __webpack_require__\b/, 'has prelude');
});

test.after(t => {
	rimraf.sync(join(__dirname, 'dist'));
});
