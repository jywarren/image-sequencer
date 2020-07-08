const testModule = require('../templates/gif-module-test.js'),
  gif = require('../images/test.gif.js'),
  benchmark = 'data:image/gif;base64,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';

testModule('rotate', {rotate:165}, benchmark, gif, 'gif');
