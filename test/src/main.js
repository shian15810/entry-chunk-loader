var test = require('./other.entry.js');

var test2 = require('../../index.js?path=children&name=child1.js!./child.js');

var d = require('../../index.js!./defaults');

var manifest = require('../../index.js?inert&path=inertOut!./manifest');

var testWithHash = require('../../index.js?name=[name].[hash:6].js!./defaults');

var testInertWithHash = require('../../index.js?inert&name=[name]-inert.[hash:6].js!./defaults');
