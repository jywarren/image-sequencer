'use strict';

var fs = require('fs');
var test = require('tape');
var DataURItoBuffer = require('data-uri-to-buffer');

require('../../../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: false });
var red = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABykX//Z";

var imageName = 'image1';
sequencer.loadImages(imageName, red);

test('benchmark all modules',function(t){

  var start, end;

  console.log("############ Benchmarks ############");

  Object.keys(sequencer.modules).forEach(function forEachModule(moduleName) {
    start = Date.new();
    sequencer.addSteps(moduleName);
    end = Date.new();
    console.log("Module " + moduleName + " ran in: " + (end-start) + " milliseconds");
    sequencer.removeStep(imageName, 0); // remove the step after we're done
  });

  console.log("####################################");

});
