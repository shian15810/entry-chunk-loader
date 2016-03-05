# spawn-loader [![Build Status](https://travis-ci.org/erikdesjardins/spawn-loader.svg?branch=master)](https://travis-ci.org/erikdesjardins/spawn-loader)

Webpack loader to spawn a new entry chunk.

Borrows heavily from [`entry-loader`](https://github.com/eoin/entry-loader).
Functions almost exactly the same, but uses the required file's basename for the chunk name.

## Installation

`npm install --save-dev spawn-loader`

## Usage

```js
var url = require('spawn?name=[name]-[hash:6].js!./file');
```
