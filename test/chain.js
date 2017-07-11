'use strict';

var fs = require('fs');
var test = require('tape');

// We should only test headless code here.
// http://stackoverflow.com/questions/21358015/error-jquery-requires-a-window-with-a-document#25622933

require('../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: "none" });
var red = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABykX//Z";

test('loadImages/loadImage has a name generator.', function (t){
  sequencer.loadImage(red);
  t.equal(sequencer.images.image1.steps.length, 1, "It Does!");
  t.end();
});

test('loadImages/loadImage returns a wrapper.', function (t){
  var returnval = sequencer.loadImage(red);
  t.equal(returnval.name,"ImageSequencer Wrapper", "It Does!");
  t.equal(returnval.images[0],"image2");
  t.end();
});

test('addSteps is two-way chainable.', function (t){
  var returnval = sequencer.loadImage(red).addSteps('invert');
  t.equal(returnval.name,"ImageSequencer Wrapper");
  t.equal(returnval.images[0],"image3");
  t.equal(sequencer.images.image3.steps.length,2);
  t.equal(sequencer.images.image3.steps[1].options.name,"invert");
  t.equal(sequencer.images.image2.steps.length,1);
  t.equal(sequencer.images.image1.steps.length,1);
  t.end();
});

test('addSteps is two-way chainable without loadImages.', function (t){
  var returnval = sequencer.addSteps("image3","ndvi-red");
  t.equal(returnval.name,"ImageSequencer");
  t.equal(sequencer.images.image3.steps.length,3);
  t.equal(sequencer.images.image3.steps[2].options.name,"ndvi-red");
  t.end();
});

test('removeSteps is two-way chainable.', function (t){
  var returnval = sequencer.loadImage(red).addSteps('invert').removeSteps(1);
  t.equal(returnval.name,"ImageSequencer Wrapper");
  t.equal(returnval.images[0],"image4");
  t.equal(sequencer.images.image4.steps.length,1);
  t.end();
});

test('removeSteps is two-way chainable without loadImages.', function (t){
  var returnval = sequencer.removeSteps("image3",1);
  t.equal(returnval.name,"ImageSequencer");
  t.equal(sequencer.images.image3.steps.length,2);
  t.end();
});

test('insertSteps is two-way chainable.', function (t){
  var returnval = sequencer.loadImage(red).insertSteps(1,'invert');
  t.equal(returnval.name,"ImageSequencer Wrapper");
  t.equal(returnval.images[0],"image5");
  t.equal(sequencer.images.image5.steps.length,2);
  t.equal(sequencer.images.image5.steps[1].options.name,"invert");
  t.end();
});

test('insertSteps is two-way chainable without loadImages.', function (t){
  var returnval = sequencer.insertSteps("image5",1,"ndvi-red");
  t.equal(returnval.name,"ImageSequencer");
  t.equal(sequencer.images.image5.steps.length,3);
  t.equal(sequencer.images.image5.steps[1].options.name,"ndvi-red");
  t.end();
});
