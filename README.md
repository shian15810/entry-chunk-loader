# spawn-loader [![Build Status](https://travis-ci.org/erikdesjardins/spawn-loader.svg?branch=master)](https://travis-ci.org/erikdesjardins/spawn-loader)

Webpack loader to spawn a new entry chunk.

A fork of [`entry-loader`](https://github.com/eoin/entry-loader), with a few improvements:

- Uses the required file's basename for the chunk name.

- Applies the [`NoErrorsPlugin`](https://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin) to the child compiler to prevent syntax errors from crashing the parent compiler in watch mode.

## Installation

`npm install --save-dev spawn-loader`

## Usage

```js
var url = require('spawn-loader?name=[name]-[hash:6].js!./file');
// url === 'file-123456.js'
```
