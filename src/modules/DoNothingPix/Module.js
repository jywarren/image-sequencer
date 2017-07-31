/*
 * This module extracts pixels and saves them as it is.
 */
module.exports = function DoNothingPix(options,UI) {

  options = options || {};
  options.title = "Do Nothing with pixels";
  UI.onSetup(options.step);
  var output;

  function draw(input,callback) {

    UI.onDraw(options.step);
    const step = this;

    function changePixel(r, g, b, a) {
      return [r, g, b, a];
    }
    function output(image,datauri,mimetype){
      step.output = {src:datauri,format:mimetype}
      options.step.output = datauri;
      UI.onComplete(options.step);
    }
    return require('../_nomodule/PixelManipulation.js')(input, {
      output: output,
      changePixel: changePixel,
      format: input.format,
      image: options.image,
      callback: callback
    });

  }

  return {
    options: options,
    draw:  draw,
    output: output,
    UI: UI
  }
}
