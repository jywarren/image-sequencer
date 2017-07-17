/*
 * Display only the green channel
 */
module.exports = function GreenChannel(options) {

  options = options || {};
  options.title = "Invert Colors";
  options.description = "Inverts the colors of the image";
  var output;

  //function setup() {} // optional

  function draw(input,callback) {
    var this_ = this;
    function changePixel(r, g, b, a) {
      return [255-r, 255-g, 255-b, a];
    }
    function output(image,datauri,mimetype){
      this_.output = {src:datauri,format:mimetype}
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
    output: output
  }
}
