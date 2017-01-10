/*
 * Image thresholding with 'image-filter-threshold'
 */
module.exports = function ImageThreshold(options) {

  options = options || {};
  options.threshold = options.threshold || 30;

  var image;

  function setup() {
    options.ui = options.createUserInterface({
      selector: 'mod-image-threshold'
    });
  }

  function draw(_image) {
    var canvas = document.createElement('canvas');
    canvas.width = _image.naturalWidth;
    canvas.height = _image.naturalHeight;
    var context = canvas.getContext('2d');
    context.drawImage(_image, 0, 0 );
    var imageData = context.getImageData(0, 0, _image.naturalWidth, _image.naturalHeight);

    var imageThreshold = require('image-filter-threshold');
    var imageFilterCore = require('image-filter-core');

    var result = imageThreshold({
      data: imageData,
      threshold: options.threshold
    }).then(function (imageData) {
      image = new Image();
      image.onload = function onLoad() {
        if (options.onComplete) options.onComplete(image);
      }
     image.src = imageFilterCore.convertImageDataToCanvasURL(imageData);
    });
  }

  function get() {
    return image;
  }

  return {
    title: "Threshold image",
    options: options,
    setup: setup,
    draw: draw,
    get: get
  }
}
