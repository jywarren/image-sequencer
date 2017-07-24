/*
 * Display only the green channel
 */
module.exports = function GreenChannel(options,UI) {

  options = options || {};
  options.title = "Green channel only";
  options.description = "Displays only the green channel of an image";
  UI.onSetup();
  var output;

  function draw(input,callback) {

    UI.onDraw();
    const step = this;

    function changePixel(r, g, b, a) {
      return [0, g, 0, a];
    }
    function output(image,datauri,mimetype){
      step.output = {src:datauri,format:mimetype};
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
    //setup: setup, // optional
    draw:  draw,
    output: output,
    UI: UI
  }
}
