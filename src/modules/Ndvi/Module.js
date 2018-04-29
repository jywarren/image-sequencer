/*
 * NDVI with red filter (blue channel is infrared)
 */
module.exports = function Ndvi(options,UI) {

  options = options || {};
  options.filter = options.filter || "red";

  // Tell the UI that a step has been set up.
  UI.onSetup(options.step);
  var output;

  // The function which is called on every draw.
  function draw(input,callback,progressObj) {

    progressObj.stop(true);
    progressObj.overrideFlag = true;

    // Tell the UI that a step is being drawn.
    UI.onDraw(options.step);
    var step = this;

    function changePixel(r, g, b, a) {
      if (options.filter == "red") var ndvi = (b - r) / (1.00 * b + r);
      if (options.filter == "blue") var ndvi = (r - b) / (1.00 * b + r);
      var x = 255 * (ndvi + 1) / 2;
      return [x, x, x, a];
    }

    function output(image,datauri,mimetype){

      // This output is accessible by Image Sequencer
      step.output = {src:datauri,format:mimetype};

      // This output is accessible by the UI.
      options.step.output = datauri;

      // Tell the UI that step has been drawn succesfully.
      UI.onComplete(options.step);
    }
    
    return require('../_nomodule/PixelManipulation.js')(input, {
      output: output,
      changePixel: changePixel,
      format: input.format,
      image: options.image,
      inBrowser: options.inBrowser,
      callback: callback
    });

  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI:UI
  }
}
