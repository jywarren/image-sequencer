/*
 * NDVI with red filter (blue channel is infrared)
 */
module.exports = function NdviRed(options) {

  options = options || {};
  options.title = "NDVI for red-filtered cameras (blue is infrared)";

  //function setup() {} // optional

  function draw(callback) {
    step = require('./_Step')(this,options);
    newdata = step[0];
    pos = step[1];
    function changePixel(r, g, b, a) {
      var ndvi = 255 * (b - r) / (1.00 * b + r);
      return [ndvi, ndvi, ndvi, a];
    }
    function output(image,datauri,mimetype){
      images[image].steps[pos].output = {src:datauri,format:mimetype}
    }
    return require('./PixelManipulation.js')(newdata, {
      output: output,
      changePixel: changePixel,
      format: newdata.format,
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
