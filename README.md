# spawn-loader [![Build Status](https://travis-ci.org/erikdesjardins/spawn-loader.svg?branch=master)](https://travis-ci.org/erikdesjardins/spawn-loader)

Webpack loader to spawn a new entry chunk.

Borrows heavily from [`entry-loader`](https://github.com/eoin/entry-loader).
Functions almost exactly the same, but uses the required file's basename for the chunk name.

The [`NoErrorsPlugin`](https://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin) is applied to the child compiler, to avoid breaking the parent compiler when compilation fails.

## Installation

`npm install --save-dev spawn-loader`

## Usage

```js
var url = require('spawn?name=[name]-[hash:6].js!./file');
```
