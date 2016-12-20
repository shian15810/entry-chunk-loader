# spawn-loader [![Build Status](https://travis-ci.org/erikdesjardins/spawn-loader.svg?branch=master)](https://travis-ci.org/erikdesjardins/spawn-loader)

Webpack loader to spawn a new entry chunk.

A fork of [`entry-loader`](https://github.com/eoin/entry-loader).
Almost exactly the same, but uses the required file's basename for the chunk name.

Additionally, the [`NoErrorsPlugin`](https://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin) is applied to the child compiler, to avoid breaking the parent compiler when compilation fails. This means that you will need to use the [bail option](https://webpack.github.io/docs/configuration.html#bail) if you want compilation to fail when an error occurs.

## Installation

`npm install --save-dev spawn-loader`

## Usage

```js
var url = require('spawn?name=[name]-[hash:6].js!./file');
```
