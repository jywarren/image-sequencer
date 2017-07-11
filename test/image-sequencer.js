'use strict';

var fs = require('fs');
var test = require('tape');

// We should only test headless code here.
// http://stackoverflow.com/questions/21358015/error-jquery-requires-a-window-with-a-document#25622933

require('../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: "none" });
var red = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABykX//Z";

test('Image Sequencer has tests', function (t) {
  t.equal(true, true);
  t.end();
});

test('loadImages loads a DataURL image and creates a step.', function (t){
  sequencer.loadImages('test',red);
  t.equal(sequencer.images.test.steps.length, 1, "It Does!");
  t.end();
});

test('loadImages loads a PATH image and creates a step. (NodeJS)', function (t){
  if(sequencer.options.inBrowser){
    t.equal("not applicable","not applicable");
    t.end();
  }
  else {
    sequencer.loadImages(red);
    t.equal(sequencer.images.test.steps.length, 1, "It Does!");
    t.end();
  }
});

test('loadImage works too.', function (t){
  sequencer.loadImage('test2',red);
  t.equal(sequencer.images.test2.steps.length, 1, "It Does!");
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

test('run() runs the sequencer and returns output to callback', function (t) {
  sequencer.run('test',function(out){
    t.equal(typeof(sequencer.images.test.steps[sequencer.images.test.steps.length - 1].output), "object", "It Does!");
    t.equal(out,sequencer.images.test.steps[sequencer.images.test.steps.length - 1].output.src, "It Does!");
  });
  t.end();
});

test('replaceImage returns false in NodeJS', function (t) {
  var returnvalue = sequencer.replaceImage("#selector","test");
  t.equal(returnvalue,false);
  t.end();
});
