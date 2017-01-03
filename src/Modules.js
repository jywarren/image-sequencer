/*
 * Core modules; externalized these wrapper modules with:
 * 'image-select': require('./modules/ImageSelect.js'),
 */
module.exports = {

  // How much of this wrapper is necessary?
  // Could it be for UI, and the actual module is for functionality?
  // But 'image-select' is not set up that way; it's UI. But it's special.
  'image-select': function ImageSelect() {

    var imageselect;

    function setup(onComplete) {
      imageselect = require('./modules/ImageSelect.js')({
        output: onComplete,
        selector: '#drop'
      });
    }

    function run(image, onComplete) {
      if (onComplete) onComplete(get());
    }

    function get() {
      return imageselect.getImage();
    }

    return {
      title: "Select image",
      run: run,
      setup: setup,
      get: get
    }

  },

  'green-channel': require('./modules/GreenChannel.js'),
  'ndvi-red': require('./modules/NdviRed.js'),
  'plot': require('./modules/Plot.js'),

/*
  'image-threshold': {
    name: "Threshold image",
    run: function imageThreshold(image, onComplete, options) {

      options = options || {};
      options.threshold = options.threshold || 30;

      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0 );
      var imageData = context.getImageData(0, 0, element.width, element.height);

      var imageThreshold = require('../node_modules/image-filter-threshold/src/index.js');

      var result = imageThreshold({
        data: imageData,
        threshold: options.threshold
      }).then(function (result) {
        var image = new Image();
        image.onload = function onLoad() {
          onComplete(image);
        }
       image.src = result;
      });

    }
  }
*/
}
