'use strict';

var test = require('tape');

// We should only test headless code here.
// http://stackoverflow.com/questions/21358015/error-jquery-requires-a-window-with-a-document#25622933

require('../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: false });
var image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABykX//Z";
sequencer.loadImages(image);

sequencer.addSteps(['do-nothing-pix','invert','invert']);
sequencer.run();

test("Inverted image isn't identical", function (t) {
  t.notEqual(sequencer.images.image1.steps[1].output.src, sequencer.images.image1.steps[2].output.src);
  t.end();
});

test("Twice inverted image is identical to original image", function (t) {
  t.equal(sequencer.images.image1.steps[1].output.src, sequencer.images.image1.steps[3].output.src);
  t.end();
});
