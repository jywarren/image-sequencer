var test = require('tape');
require('../../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: false });
var red = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABykX//Z";

test('toString() and stepToString() return the step/steps in string format',function(t){
  sequencer.loadImages('image1', red);
  sequencer.addSteps('channel');
  sequencer.addSteps('invert');
  t.equal(sequencer.toString(),"channel(channel:green),invert()","toString works");
  t.equal(sequencer.stepToString(sequencer.steps[1]),"channel(channel:green)","stepToString works");
  t.end();
});