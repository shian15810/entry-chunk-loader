import { readFileSync, statSync } from 'fs';
import { resolve } from 'path';

import test from 'ava';
import webpack from 'webpack';

test('basic usage', async t => {
	await new Promise((resolve, reject) => {
		webpack({
			entry: resolve(__dirname, 'src/main.js'),
			bail: true,
			output: {
				path: resolve(__dirname, 'dist'),
				filename: 'main.bundle.js'
			},
			module: {
				loaders: [
					{ test: /\.entry\.js$/, loader: resolve(__dirname, '../index.js'), query: { name: '[name].spawned.js' } }
				]
			}
		}, (err, stats) => {
			err ? reject(err) : resolve(stats);
		});
	});

	t.ok(statSync(resolve(__dirname, 'dist/main.bundle.js')), 'main bundle exists');
	t.ok(statSync(resolve(__dirname, 'dist/other.entry.spawned.js')), 'second entry bundle exists');
});

test.after(t => {
	rimraf(resolve(__dirname, 'dist'));
});
