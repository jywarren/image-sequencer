/*
 * NDVI with red filter (blue channel is infrared)
 */
module.exports = function NdviRed(options) {

  options = options || {};
  options.title = "NDVI for red-filtered cameras (blue is infrared)";
  var output;

  //function setup() {} // optional

  function draw(input,callback) {
    this_ = this;
    function changePixel(r, g, b, a) {
      var ndvi = 255 * (b - r) / (1.00 * b + r);
      return [ndvi, ndvi, ndvi, a];
    }
    function output(image,datauri,mimetype){
      this_.output = {src:datauri,format:mimetype}
    }
    return require('./PixelManipulation.js')(input, {
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
    draw: draw
  }
}
