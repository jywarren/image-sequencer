'use strict';

var fs = require('fs');
var test = require('tape');

// We should only test headless code here.
// http://stackoverflow.com/questions/21358015/error-jquery-requires-a-window-with-a-document#25622933

require('../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: "none" });

test('Image Sequencer has tests', function (t) {
  t.equal(true, true);
  t.end();
});

test('loadImages loads an image and creates a step.', function (t){
  sequencer.loadImages('test','examples/red.jpg');
  t.equal(sequencer.images.test.steps.length, 1, "It Does!");
  t.end();
});

test('addSteps("image","name") adds a step', function (t) {
  sequencer.addSteps('test','do-nothing');
  t.equal(sequencer.images.test.steps[1].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps.length, 2, "It Does!")
  t.end();
});

test('addSteps("name") adds a step', function (t) {
  sequencer.addSteps('do-nothing');
  t.equal(sequencer.images.test.steps[2].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps.length, 3, "It Does!")
  t.end();
});

test('addSteps(["name"]) adds a step', function (t) {
  sequencer.addSteps(['do-nothing','do-nothing-pix']);
  t.equal(sequencer.images.test.steps[3].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps[4].options.name, "do-nothing-pix");
  t.equal(sequencer.images.test.steps.length, 5, "It Does!")
  t.end();
});

test('addSteps("name",o) adds a step', function (t) {
  sequencer.addSteps('do-nothing',{});
  t.equal(sequencer.images.test.steps[5].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps.length, 6, "It Does!")
  t.end();
});

test('addSteps("image","name",o) adds a step', function (t) {
  sequencer.addSteps('test','do-nothing',{});
  t.equal(sequencer.images.test.steps[6].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps.length, 7, "It Does!")
  t.end();
});

test('removeSteps("image",position) removes a step', function (t) {
  sequencer.removeSteps('test',1);
  t.equal(sequencer.images.test.steps.length, 6, "It Does!");
  t.end();
});

test('removeSteps({image: [positions]}) removes steps', function (t) {
  sequencer.removeSteps('test',[1,2]);
  t.equal(sequencer.images.test.steps.length, 4, "It Does!");
  t.end();
});

test('removeSteps(position) removes steps', function (t) {
  sequencer.removeSteps([1,2]);
  t.equal(sequencer.images.test.steps.length, 2, "It Does!");
  t.end();
});

test('insertSteps("image",position,"module",options) inserts a step', function (t) {
  sequencer.insertSteps('test',1,'do-nothing',{});
  t.equal(sequencer.images.test.steps[1].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps.length, 3, "It Does!");
  t.end();
});

test('insertSteps("image",position,"module") inserts a step', function (t) {
  sequencer.insertSteps('test',1,'do-nothing');
  t.equal(sequencer.images.test.steps[1].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps.length, 4, "It Does!");
  t.end();
});

test('insertSteps(position,"module") inserts a step', function (t) {
  sequencer.insertSteps(1,'do-nothing');
  t.equal(sequencer.images.test.steps[1].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps.length, 5, "It Does!");
  t.end();
});

test('insertSteps({image: {index: index, name: "module", o: options} }) inserts a step', function (t) {
  sequencer.insertSteps({test: {index:1, name:'do-nothing', o:{} } });
  t.equal(sequencer.images.test.steps[1].options.name, "do-nothing");
  t.equal(sequencer.images.test.steps.length, 6, "It Does!");
  t.end();
});

test('run() runs the sequencer', function (t) {
  sequencer.run();
  t.equal(typeof(sequencer.images.test.steps[sequencer.images.test.steps.length - 1].output), "object", "It Does!");
  t.end();
});
