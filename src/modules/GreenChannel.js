/*
 * Display only the green channel
 */
module.exports = function GreenChannel(options) {

  options = options || {};

  //function setup() {} // optional

  function draw(image) {
    function changePixel(r, g, b, a) {
      return [0, g, 0, a];
    }
    return require('./PixelManipulation.js')(image, {
      output: options.output,
      changePixel: changePixel
    });
  }

  return {
    title: "Green channel only",
    description: "Displays only the green channel of an image",
    options: options,
    //setup: setup, // optional
    draw:  draw
  }
}
