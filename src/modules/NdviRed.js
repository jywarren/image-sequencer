/*
 * NDVI with red filter (blue channel is infrared)
 */
module.exports = function NdviRed(options) {

  options = options || {};

  var image,
      selector = 'mod-ndvi-red',
      random = options.random || parseInt(Math.random() * (new Date()).getTime() / 1000000),
      uniqueSelector = selector + '-' + random, 
      el;

  // should we just run setup on constructor?
  function setup() {

    $(options.container).append('<div class="panel ' + selector + ' ' + uniqueSelector + '"></div>');
    el = $('.' + uniqueSelector);

  }

  function run(_image, onComplete, options) {
    require('./PixelManipulation.js')(_image, {
      onComplete: function displayImage(image) {
        el.html(image);
        onComplete(image);
      },
      changePixel: changePixel
    });

  }

  function changePixel(r, g, b, a) {
    var ndvi = 255 * (b - r) / (1.00 * b + r);
    return [ndvi, ndvi, ndvi, a];
  }

  return {
    title: "NDVI for red-filtered cameras (blue is infrared)",
    run: run,
    setup: setup,
    image: image
  }
}
