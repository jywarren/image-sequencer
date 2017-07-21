/*
 * Display only the green channel
 */
module.exports = function GreenChannel(options,UI) {

  options = options || {};
  options.title = "Green channel only";
  options.description = "Displays only the green channel of an image";
  UI.setup();
  var output;

  function draw(input,callback) {

    UI.drawing();
    var this_ = this;

    function changePixel(r, g, b, a) {
      return [0, g, 0, a];
    }
    function output(image,datauri,mimetype){
      this_.output = {src:datauri,format:mimetype};
      UI.drawn(datauri);
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
