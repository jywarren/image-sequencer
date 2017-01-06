/*
 * NDVI with red filter (blue channel is infrared)
 */
module.exports = function NdviRed(options) {

  options = options || {};

  var image;

  function setup() {
    options.ui = options.createUserInterface({
      selector: 'mod-ndvi-red'
    });
  }

  function draw(_image) {
    require('./PixelManipulation.js')(_image, {
      onComplete: options.onComplete,
      changePixel: changePixel
    });
  }

  function changePixel(r, g, b, a) {
    var ndvi = 255 * (b - r) / (1.00 * b + r);
    return [ndvi, ndvi, ndvi, a];
  }

  return {
    title: "NDVI for red-filtered cameras (blue is infrared)",
    options: options,
    draw: draw,
    setup: setup
  }
}
