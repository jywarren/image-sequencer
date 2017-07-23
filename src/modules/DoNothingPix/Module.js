/*
 * This module extracts pixels and saves them as it is.
 */
module.exports = function DoNothingPix(options,UI) {

  options = options || {};
  options.title = "Do Nothing with pixels";
  UI.onSetup();
  var output;

  function draw(input,callback) {

    UI.onDraw();
    var this_ = this;

    function changePixel(r, g, b, a) {
      return [r, g, b, a];
    }
    function output(image,datauri,mimetype){
      this_.output = {src:datauri,format:mimetype}
      UI.onComplete(datauri);
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
