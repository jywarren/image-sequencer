/*
 * Decodes QR from a given image.
 */
module.exports = function DoNothing(options,UI) {
  options = options || {};
  options.title = "Decode QR Code";
  UI.onSetup(options.step);
  var output;
  var jsQR = require('jsqr');
  var getPixels = require('get-pixels');

  function draw(input,callback) {

    UI.onDraw(options.step);

    const step = this;
    getPixels(input.src,function(err,pixels){
      if(err) throw err;
      var w = pixels.shape[0];
      var h = pixels.shape[1];
      var decoded = jsQR.decodeQRFromImage(pixels.data,w,h);
      step.output = input;
      step.output.data = decoded;
      callback();
      options.step.output = input.src;
      UI.onComplete(options.step);
    });
  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
