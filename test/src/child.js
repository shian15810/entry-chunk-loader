var baz = require('file-loader?name=hi.jpg!./hi.jpg');
var child2 = require('../../index.js?path=subchild&name=subchild.js!./child2.js');
