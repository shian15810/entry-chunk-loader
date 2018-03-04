import { readFileSync, statSync } from 'fs';
import { join } from 'path';

import test from 'ava';
import webpack from 'webpack';
import rimraf from 'rimraf';

test('basic usage', async t => {
	await new Promise((resolve, reject) => {
		webpack({
			mode: 'development',
			devtool: false,
			entry: join(__dirname, 'src/main.js'),
			bail: true,
			output: {
				path: join(__dirname, 'dist'),
				filename: 'main.bundle.js'
			},
			module: {
				rules: [{
					test: /\.entry\.js$/,
					use: {
						loader: join(__dirname, '../index.js'),
						options: { name: '[name].spawned.js' }
					}
				}]
			}
		}, (err, stats) => {
			stats.hasErrors() ? reject(stats.toString()) : resolve(stats);
		});
	});

	const mainBundle = readFileSync(join(__dirname, 'dist/main.bundle.js'), 'utf8');
	const otherEntry = readFileSync(join(__dirname, 'dist/other.entry.spawned.js'), 'utf8');
	const hi = readFileSync(join(__dirname, 'dist/children/hi.jpg'));
	const child1 = readFileSync(join(__dirname, 'dist/children/child1.js'), 'utf8');
	const subchild = readFileSync(join(__dirname, 'dist/children/subchild/subchild.js'), 'utf8');
	const defaults = readFileSync(join(__dirname, 'dist/defaults.js'), 'utf8');
	const manifest = readFileSync(join(__dirname, 'dist/inertOut/manifest.notjson'), 'utf8');
	const defaultsWithHash = readFileSync(
		join(__dirname, process.platform === 'win32' ? 'dist/defaults.70b6b5.js' : 'dist/defaults.9eda03.js'),
		'utf8'
	);
	const defaultsInertWithHash = readFileSync(
		join(__dirname, process.platform === 'win32' ? 'dist/defaults-inert.3876bd.js' : 'dist/defaults-inert.2f0c2f.js'),
		'utf8'
	);

	t.regex(mainBundle, /"other\.entry\.spawned\.js"/, 'references spawned other entry');
	t.regex(mainBundle, /"children(\/|\\\\)child1\.js"/, 'references spawned child1');
	t.regex(mainBundle, /"defaults\.js"/, 'references spawned defaults');
	t.regex(mainBundle, /"inertOut(\/|\\\\)manifest\.notjson"/, 'references spawned manifest.json');
	t.regex(
		mainBundle,
		process.platform === 'win32' ? /"defaults.70b6b5.js"/ : /"defaults.9eda03.js"/,
		'references spawned defaults with hash'
	);
	t.regex(
		mainBundle,
		process.platform === 'win32' ? /"defaults-inert.3876bd.js"/ : /"defaults-inert.2f0c2f.js"/,
		'references spawned inert defaults with hash'
	);
	t.regex(mainBundle, /__webpack_require__\.p = ""/, 'publicPath is empty');

	t.regex(otherEntry, /\bfunction __webpack_require__\b/, 'has prelude');
	t.regex(otherEntry, /var foo = bar;/, 'has expected content');
	t.regex(otherEntry, /__webpack_require__\.p = ""/, 'publicPath is empty');

	t.truthy(hi, 'hi.jpg exists');

	t.regex(child1, /\bfunction __webpack_require__\b/, 'has prelude');
	t.regex(child1, /"hi\.jpg"/, 'references hi.jpg');
	t.regex(child1, /"subchild(\/|\\\\)subchild\.js"/, 'references spawned subchild');
	t.regex(child1, /__webpack_require__\.p = ""/, 'publicPath is empty');

	t.regex(subchild, /\bfunction __webpack_require__\b/, 'has prelude');
	t.regex(subchild, /var a = 'b';/, 'has expected content');
	t.regex(subchild, /__webpack_require__\.p = ""/, 'publicPath is empty');

	t.regex(defaults, /\bfunction __webpack_require__\b/, 'has prelude');
	t.regex(defaults, /var def = 'aults';/, 'has expected content');
	t.regex(defaults, /__webpack_require__\.p = ""/, 'publicPath is empty');

	t.regex(manifest, /^\{ "manifest": "json" \}\s+$/, 'manifest.json exists, is raw content');

	t.regex(defaultsWithHash, /\bfunction __webpack_require__\b/, 'has prelude');
	t.regex(defaultsWithHash, /var def = 'aults';/, 'has expected content');
	t.regex(defaultsWithHash, /__webpack_require__\.p = ""/, 'publicPath is empty');

	t.regex(defaultsInertWithHash, /^var def = 'aults';\s+$/, 'has expected, raw content');
});

test.after(t => {
	rimraf.sync(join(__dirname, 'dist'));
});
