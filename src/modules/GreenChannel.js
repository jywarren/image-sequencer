/*
 * Display only the green channel
 */
module.exports = function GreenChannel(options) {

  options = options || {};

  var image;

  function setup() {
    options.ui = options.createUserInterface({
      selector: 'mod-green-channel'
    });
  }

  function draw(_image) {
    require('./PixelManipulation.js')(_image, {
      onComplete: options.onComplete,
      changePixel: changePixel
    });

  }

  function changePixel(r, g, b, a) {
    return [0, g, 0, a];
  }

  return {
    title: "Green channel only",
    options: options,
    draw:  draw,
    setup: setup
  }
}
