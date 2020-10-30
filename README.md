# entry-chunk-loader

Webpack loader to generate a new entry chunk.

A fork of [`spawn-loader`](https://github.com/erikdesjardins/spawn-loader), with a few notable changes:

- Supports [Webpack 5](https://webpack.js.org/blog/2020-10-10-webpack-5-release/).
- Supports native [ECMAScript modules](https://nodejs.org/api/esm.html) of Node.js.

## Installation

`npm install --save-dev entry-chunk-loader`

## Usage

### ECMAScript modules

```js
// simplest usage: emits otherBundle.js in the same directory
import url from 'entry-chunk-loader!./otherBundle');
// url === 'otherBundle.js'

// build into a subdir: emits otherBundle.js
// (and any assets it emits) into childDir/
import url from 'entry-chunk-loader?path=childDir!./otherBundle';
// url === 'childDir/otherBundle.js'

// specify a different name
import url from 'entry-chunk-loader?name=bundle.js!./file';
// url === 'bundle.js'

// emit the required file as-is, with no prelude
// only useful in combination with other loaders
import url from 'entry-chunk-loader?inert!./manifest.json';
// url === 'manifest.json'
```

### CommonJS modules

```js
// simplest usage: emits otherBundle.js in the same directory
const url = require('entry-chunk-loader!./otherBundle');
// url === 'otherBundle.js'

// build into a subdir: emits otherBundle.js
// (and any assets it emits) into childDir/
const url = require('entry-chunk-loader?path=childDir!./otherBundle');
// url === 'childDir/otherBundle.js'

// specify a different name
const url = require('entry-chunk-loader?name=bundle.js!./file');
// url === 'bundle.js'

// emit the required file as-is, with no prelude
// only useful in combination with other loaders
const url = require('entry-chunk-loader?inert!./manifest.json');
// url === 'manifest.json'
```
