/*
 * Invert the image
 */
module.exports = function Invert(options, UI) {

  options = options || {};

  // Tell UI that a step has been set up.
  UI.onSetup(options.step);
  var output;

  // The function which is called on every draw.
  function draw(input, callback, progressObj) {

    console.log(getStep(-2).options.name);
    console.log(getStep(-1).options.name);
    console.log(getStep(0).options.name);
    progressObj.stop(true);
    progressObj.overrideFlag = true;
    // Tell UI that a step is being drawn.
    UI.onDraw(options.step);

    var step = this;

    function changePixel(r, g, b, a) {
      return [255 - r, 255 - g, 255 - b, a];
    }

    function output(image, datauri, mimetype) {

      // This output is accessible by Image Sequencer
      step.output = { src: datauri, format: mimetype };

      // This output is accessible by UI
      options.step.output = datauri;

      // Tell UI that step has been drawn.
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
