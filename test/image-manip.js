'use strict';

var test = require('tape');

// We should only test headless code here.
// http://stackoverflow.com/questions/21358015/error-jquery-requires-a-window-with-a-document#25622933

require('../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: false });
var image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABlBMVEX+AAD///+KQee0AAAAAWJLR0QB/wIt3gAAAAd0SU1FB+EGHRIVAvrm6EMAAAAMSURBVAjXY2AgDQAAADAAAceqhY4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDYtMjlUMTg6MjE6MDIrMDI6MDDGD83DAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA2LTI5VDE4OjIxOjAyKzAyOjAwt1J1fwAAAABJRU5ErkJggg==";
sequencer.loadImages(image);

sequencer.addSteps(['do-nothing-pix','invert','invert']);

test("Preload", function(t) {
  sequencer.run(function(){
    t.end();
  });
});

test("Inverted image isn't identical", function (t) {
  t.notEqual(sequencer.images.image1.steps[1].output.src, sequencer.images.image1.steps[2].output.src);
  t.end();
});

test("Twice inverted image is identical to original image", function (t) {
  t.equal(sequencer.images.image1.steps[1].output.src, sequencer.images.image1.steps[3].output.src);
  t.end();
});
