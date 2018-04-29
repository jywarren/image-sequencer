module.exports = function Colormap(options,UI) {

  options = options || {};

  // Tell the UI that a step has been set up.
  UI.onSetup(options.step);
  var output;

  // This function is called on every draw.
  function draw(input,callback,progressObj) {

    progressObj.stop(true);
    progressObj.overrideFlag = true;

    // Tell the UI that the step is being drawn
    UI.onDraw(options.step);
    var step = this;

    function changePixel(r, g, b, a) {
      var combined = (r + g + b) / 3.000;
      var res = require('./Colormap')(combined, options);
      return [res[0], res[1], res[2], 255];
    }

    function output(image,datauri,mimetype){

      // This output is accessible by Image Sequencer
      step.output = { src: datauri, format: mimetype };

      // This output is accessible by the UI
      options.step.output = datauri;

      // Tell the UI that the draw is complete
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
    UI: UI
  }
}
