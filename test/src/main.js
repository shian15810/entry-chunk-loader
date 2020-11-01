const test2 = require('../../index.js?path=children&name=child1.js!./child.js');
const manifest = require('../../index.js?inert&path=inertOut!./manifest.notjson');
const testInertWithHash = require('../../index.js?inert&name=[name]-inert.[hash:6].js!./defaults');
const testWithHash = require('../../index.js?name=[name].[hash:6].js!./defaults');
const d = require('../../index.js!./defaults');
const test = require('./other.entry.js');
