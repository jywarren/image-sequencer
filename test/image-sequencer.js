'use strict';

var fs = require('fs');
var test = require('tape');

// We should only test headless code here. 
// http://stackoverflow.com/questions/21358015/error-jquery-requires-a-window-with-a-document#25622933 

require('../dist/image-sequencer.js');

var sequencer = ImageSequencer({ ui: false });

//function read (file) {
//  return fs.readFileSync('./test/fixtures/' + file, 'utf8').trim();
//}

//function write (file, data) { /* jshint ignore:line */
//  return fs.writeFileSync('./test/fixtures/' + file, data + '\n', 'utf8');
//}

test('Image Sequencer has tests', function (t) {
  // read('something.html')
  t.equal(true, true);
  t.end();
});

test('addStep adds a step', function (t) {
  t.equal(sequencer.steps.length, 0);
  sequencer.addStep('ndvi-red');
  t.equal(sequencer.steps.length, 1);
  t.end();
});

test('each module conforms to base API except image-select', function (t) {
  Object.keys(sequencer.modules).forEach(function(moduleName, i) {
    if (moduleName != "image-select") sequencer.addStep(moduleName);
  });
  // should already have image-select:
  t.equal(sequencer.steps.length, Object.keys(sequencer.modules).length);
  sequencer.steps.forEach(function(step, i) {
    //t.equal(step.test(step.testInput),step.testOutput);
    // or check that it's equal with a diff method?
    // we could also test each type of output
    t.equal(step.setup === 'undefined', false);
    t.equal(step.draw === 'undefined', false);
  });
  t.end();
});

//test('a blank module does not modify an image, according to diff', function (t) {
  
//});

//test('a module modifies an image', function (t) {
  
//});
