const baz = require('file-loader?name=hi.jpeg!./hi.jpeg');
const child2 = require('../../index.js?path=subchild&name=subchild.js!./child2.js');
