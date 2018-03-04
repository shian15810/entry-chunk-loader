# spawn-loader [![Build Status](https://travis-ci.org/erikdesjardins/spawn-loader.svg?branch=master)](https://travis-ci.org/erikdesjardins/spawn-loader)

Webpack loader to spawn a new entry chunk.

A fork of [`entry-loader`](https://github.com/eoin/entry-loader), with a few changes:

- Gives descriptive names to the chunk and child compiler.

- Adds a `path` option to output files to a subdirectory.

## Installation

`npm install --save-dev spawn-loader`

## Usage

```js
// simplest usage: emits otherBundle.js in the same directory
var url = require('spawn-loader!./otherBundle');
// url === 'otherBundle.js'

// build into a subdir: emits otherBundle.js
// (and any assets it emits) into childDir/
var url = require('spawn-loader?path=childDir!./otherBundle');
// url === 'childDir/otherBundle.js'

// specify a different name
var url = require('spawn-loader?name=bundle.js!./file');
// url === 'bundle.js'

// emit the required file as-is, with no prelude
// only useful in combination with other loaders
var url = require('spawn-loader?inert!./manifest.json');
// url === 'manifest.json'
```
