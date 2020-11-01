import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import test from 'ava';
import rimraf from 'rimraf';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('basic usage', async (t) => {
  await new Promise((resolve, reject) => {
    webpack(
      {
        mode: 'development',
        devtool: false,
        entry: join(__dirname, 'src/main.js'),
        bail: true,
        output: {
          path: join(__dirname, 'dist'),
          filename: 'main.bundle.js',
        },
        module: {
          rules: [
            {
              test: /\.entry\.js$/,
              use: {
                loader: join(__dirname, '../index.cjs'),
                options: { name: '[name].chunk.js' },
              },
            },
          ],
        },
      },
      (err, stats) => {
        stats.hasErrors() ? reject(stats.toString()) : resolve(stats);
      },
    );
  });

  const mainBundle = readFileSync(
    join(__dirname, 'dist/main.bundle.js'),
    'utf8',
  );
  const otherEntry = readFileSync(
    join(__dirname, 'dist/other.entry.chunk.js'),
    'utf8',
  );
  const hi = readFileSync(join(__dirname, 'dist/children/hi.jpeg'));
  const child1 = readFileSync(
    join(__dirname, 'dist/children/child1.js'),
    'utf8',
  );
  const subchild = readFileSync(
    join(__dirname, 'dist/children/subchild/subchild.js'),
    'utf8',
  );
  const defaults = readFileSync(join(__dirname, 'dist/defaults.js'), 'utf8');
  const manifest = readFileSync(
    join(__dirname, 'dist/inertOut/manifest.notjson'),
    'utf8',
  );
  const defaultsWithHash = readFileSync(
    join(__dirname, 'dist/defaults.9a88b0.js'),
    'utf8',
  );
  const defaultsInertWithHash = readFileSync(
    join(__dirname, 'dist/defaults-inert.9b489c.js'),
    'utf8',
  );

  t.regex(
    mainBundle,
    /"other\.entry\.chunk\.js"/,
    'references other entry chunk',
  );
  t.regex(
    mainBundle,
    /"children(\/|\\\\)child1\.js"/,
    'references child1 chunk',
  );
  t.regex(mainBundle, /"defaults\.js"/, 'references defaults chunk');
  t.regex(
    mainBundle,
    /"inertOut(\/|\\\\)manifest\.notjson"/,
    'references manifest.json chunk',
  );
  t.regex(
    mainBundle,
    /"defaults.9a88b0.js"/,
    'references defaults chunk with hash',
  );
  t.regex(
    mainBundle,
    /"defaults-inert.9b489c.js"/,
    'references inert defaults chunk with hash',
  );
  t.regex(mainBundle, /__webpack_require__\.p = ""/, 'publicPath is empty');

  t.regex(otherEntry, /\bfunction __webpack_require__\b/, 'has prelude');
  t.regex(otherEntry, /const foo = bar;/, 'has expected content');
  t.regex(otherEntry, /__webpack_require__\.p = ""/, 'publicPath is empty');

  t.truthy(hi, 'hi.jpeg exists');

  t.regex(child1, /\bfunction __webpack_require__\b/, 'has prelude');
  t.regex(child1, /"hi\.jpeg"/, 'references hi.jpeg');
  t.regex(
    child1,
    /"subchild(\/|\\\\)subchild\.js"/,
    'references subchild chunk',
  );
  t.regex(child1, /__webpack_require__\.p = ""/, 'publicPath is empty');

  t.regex(subchild, /\bfunction __webpack_require__\b/, 'has prelude');
  t.regex(subchild, /const a = 'b';/, 'has expected content');
  t.regex(subchild, /__webpack_require__\.p = ""/, 'publicPath is empty');

  t.regex(defaults, /\bfunction __webpack_require__\b/, 'has prelude');
  t.regex(defaults, /const def = 'aults';/, 'has expected content');
  t.regex(defaults, /__webpack_require__\.p = ""/, 'publicPath is empty');

  t.regex(
    manifest,
    /^\{\s+"manifest": "json"\s+\}\s+$/,
    'manifest.json exists, is raw content',
  );

  t.regex(defaultsWithHash, /\bfunction __webpack_require__\b/, 'has prelude');
  t.regex(defaultsWithHash, /const def = 'aults';/, 'has expected content');
  t.regex(
    defaultsWithHash,
    /__webpack_require__\.p = ""/,
    'publicPath is empty',
  );

  t.regex(
    defaultsInertWithHash,
    /^export const def = 'aults';\s+$/,
    'has expected, raw content',
  );
});

test.after((t) => {
  rimraf.sync(join(__dirname, 'dist'));
});
