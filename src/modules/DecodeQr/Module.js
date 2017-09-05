/*
 * Decodes QR from a given image.
 */
module.exports = function DoNothing(options,UI) {

  options = options || {};
  options.title = "Decode QR Code";

  // Tell the UI that a step has been added
  UI.onSetup(options.step);

  var output;
  var jsQR = require('jsqr');
  var getPixels = require('get-pixels');

  // This function is called everytime a step has to be redrawn
  function draw(input,callback) {

    UI.onDraw(options.step);

    var step = this;

    getPixels(input.src,function(err,pixels){

      if(err) throw err;

      var w = pixels.shape[0];
      var h = pixels.shape[1];
      var decoded = jsQR.decodeQRFromImage(pixels.data,w,h);

      // This output is accessible to Image Sequencer
      step.output = input;
      step.output.data = decoded;

      // Tell Image Sequencer that this step is complete
      callback();

      // These values are accessible to the UI
      options.step.output = input.src;
      options.step.qrval = decoded;

      // Tell the UI that the step is complete and output is set
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
