/*
 * Image thresholding with 'image-filter-threshold'
 */
module.exports = function ImageThreshold(options, UI) {
  options = options || {};
  options.title = "Threshold image";
  options.threshold = options.threshold || 50;

  UI.onSetup(options.step);

  var output;

  function draw(input, callback) {

    UI.onDraw(options.step);
    var image = new Image();
    image.src = input.src;
    var canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    var imageData = context.getImageData(0, 0, image.naturalWidth, image.naturalHeight);

    var imageThreshold = require('image-filter-threshold');
    var imageFilterCore = require('image-filter-core');

    var result = imageThreshold({
      data: imageData,
      threshold: options.threshold
    }).then(function (imageData) {
      image = new Image();
      image.onload = function onLoad() {
        this.output = {
          format: input.type, 
          src: image.src
        }
        options.step.output = output.src;
        callback();
        UI.onComplete(options.step);
      }
     image.src = imageFilterCore.convertImageDataToCanvasURL(imageData);
    });
  }

  function get() {
    return image;
  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
