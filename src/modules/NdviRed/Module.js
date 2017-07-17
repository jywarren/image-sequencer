/*
 * NDVI with red filter (blue channel is infrared)
 */
module.exports = function NdviRed(options) {

  options = options || {};
  options.title = "NDVI for red-filtered cameras (blue is infrared)";
  var output;

  function draw(input,callback) {
    var this_ = this;
    function changePixel(r, g, b, a) {
      var ndvi = (b - r) / (1.00 * b + r);
      var x = 255 * (ndvi + 1) / 2;
      return [x, x, x, a];
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
    draw: draw
  }
}
