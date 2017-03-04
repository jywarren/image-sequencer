/*
 * Resize image
 */
module.exports = function Resize(options) {
  options.title = "Resize image";
  options.description = "Resizes image to given width";

  options = options || {};

  function setup() {

  }

  function draw(image) {



  }

  return {
    options: options,
    setup: setup,
    draw:  draw
  }
}
