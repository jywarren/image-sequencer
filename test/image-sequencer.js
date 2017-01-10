'use strict';

var fs = require('fs');
var test = require('tape');

// We should only test headless code here. 
// http://stackoverflow.com/questions/21358015/error-jquery-requires-a-window-with-a-document#25622933 

require('../dist/image-sequencer.js');

var sequencer = ImageSequencer({
  defaultSteps: function() {
    console.log('defaults');
  }
});

function read (file) {
  return fs.readFileSync('./test/fixtures/' + file, 'utf8').trim();
}

function write (file, data) { /* jshint ignore:line */
  return fs.writeFileSync('./test/fixtures/' + file, data + '\n', 'utf8');
}

test('Image Sequencer has tests', function (t) {
  // read('something.html')
  t.equal(true, true);
  t.end();
});
