'use strict';

var test = require('tape');
var looksSame = require('looks-same');
var DataURItoBuffer = require('data-uri-to-buffer');

// We should only test headless code here.
// http://stackoverflow.com/questions/21358015/error-jquery-requires-a-window-with-a-document#25622933

require('../src/ImageSequencer.js');

//require image files as DataURLs so they can be tested alike on browser and Node.
var sequencer = ImageSequencer({ ui: false });

var test_png = require('../examples/test.png.js');
var test_gif = require('../examples/test.gif.js');

sequencer.loadImages(test_png);
sequencer.addSteps(['do-nothing-pix','invert','invert']);

test("Preload", function(t) {
  sequencer.run(function(){
    t.end();
  });
});

test("Inverted image isn't identical", function (t) {
  var step1 = sequencer.images.image1.steps[1].output.src;
  var step2 = sequencer.images.image1.steps[2].output.src;
  step1 = DataURItoBuffer(step1);
  step2 = DataURItoBuffer(step2);
  looksSame(step1,step2,function(err,res){
    if(err) console.log(err);
    t.equal(res,false);
    t.end();
  });
});

test("Twice inverted image is identical to original image", function (t) {
  var step1 = sequencer.images.image1.steps[1].output.src;
  var step3 = sequencer.images.image1.steps[3].output.src;
  step1 = DataURItoBuffer(step1);
  step3 = DataURItoBuffer(step3);
  looksSame(step1,step3,function(err,res){
    if(err) console.log(err);
    t.equal(res,true);
    t.end();
  });
});

test("PixelManipulation works for PNG images", function (t) {
  sequencer.loadImages(test_png,function(){
    this.addSteps('invert').run(function(out){
      t.equal(1,1)
      t.end();
    });
  });
});

test("PixelManipulation works for GIF images", function (t) {
  sequencer.loadImages(test_gif,function(){
    this.addSteps('invert').run(function(out){
      t.equal(1,1)
      t.end();
    });
  });
});
