/*
 * Image thresholding with 'image-filter-threshold'
 */
module.exports = function ImageThreshold(options) {
  options = options || {};
  options.title = "Threshold image";
  options.threshold = options.threshold || 30;

  var image;

  function draw(inputImage) {
    $(inputImage).load(function(){
      var canvas = document.createElement('canvas');
      canvas.width = inputImage.naturalWidth;
      canvas.height = inputImage.naturalHeight;
      var context = canvas.getContext('2d');
      context.drawImage(inputImage, 0, 0);

      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      var imageThreshold = require('image-filter-threshold');
      var imageFilterCore = require('image-filter-core');

      var result = imageThreshold({
        data: imageData,
        threshold: options.threshold
      }).then(function (imageData) {
       image = {};
       image.src = src;
       image.width = 0;
       image.height = 0;
       img = sharp(image.src);
       img.metadata().then(function(metadata){
         image.width = metadata.width;
         image.height = metadata.height;
         image.naturalWidth = metadata.width;
         image.naturalHeight = metadata.height;
         if (options.output) options.output(image);
       });

      });
    });
  }

  function get() {
    return image;
  }

  return {
    options: options,
    draw: draw,
    get: get
  }
}
