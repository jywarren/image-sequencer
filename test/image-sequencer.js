'use strict';

var fs = require('fs');
var test = require('tape');

// We should only test headless code here.
// http://stackoverflow.com/questions/21358015/error-jquery-requires-a-window-with-a-document#25622933

require('../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: "none" });

//function read (file) {
//  return fs.readFileSync('./test/fixtures/' + file, 'utf8').trim();
//}

//function write (file, data) { /* jshint ignore:line */
//  return fs.writeFileSync('./test/fixtures/' + file, data + '\n', 'utf8');
//}

test('Image Sequencer has tests', function (t) {
  t.equal(true, true);
  t.end();
});

test('loadImages loads a step', function (t){
  sequencer.loadImages('test','examples/red.jpg');
  t.equal(sequencer.images.test.steps.length, 1, "It Does!");
  t.end();
});

test('addStep adds a step', function (t) {
  sequencer.addSteps('test','do-nothing');
  t.equal(sequencer.images.test.steps[1].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps.length, 2, "It Does!")
  t.end();
});

test('removeSteps removes a step', function (t) {
  sequencer.removeSteps('test',1);
  t.equal(sequencer.images.test.steps.length, 1, "It Does!");
  t.end();
});

test('insertStep inserts a step', function (t) {
  sequencer.insertSteps('test',1,'do-nothing');
  t.equal(sequencer.images.test.steps[1].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps.length, 2, "It Does!");
  t.end();
});

test('run creates output of steps', function (t) {
  sequencer.run();
  var steps = sequencer.images.test.steps
  var type = typeof(steps[steps.length-1].output)
  t.equal(type,"object");
  t.end();
});
