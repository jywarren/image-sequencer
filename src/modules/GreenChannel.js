/*
 * Display only the green channel
 */
module.exports = function GreenChannel(options) {

  options = options || {};

  var image,
      selector = 'mod-green-channel',
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
    return [0, g, 0, a];
  }

  return {
    title: "Green channel only",
    run: run,
    setup: setup,
    image: image
  }
}
