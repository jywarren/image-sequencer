/*
 * Core modules; externalized these wrapper modules with:
 * 'image-select': require('./modules/ImageSelect.js'),
 */
module.exports = {

  // How much of this wrapper is necessary?
  // Could it be for UI, and the actual module is for functionality?
  // But 'image-select' is not set up that way; it's UI. But it's special.
  'image-select': function ImageSelect() {

    var imageselect, 
        image;

    function setup(onComplete) {
      imageselect = require('./modules/ImageSelect.js')({
        output: onComplete,
        selector: '#drop'
      });
    }

    function run() {
      image = imageselect.getImage();
      return image;
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

  'passthrough': function Passthrough(options) {

    options = options || {};

    var image,
        selector = 'mod-passthrough',
        random = options.random || parseInt(Math.random() * (new Date()).getTime() / 1000000),
        uniqueSelector = selector + '-' + random, 
        el;

    // should we just run setup on constructor?
    function setup() {

      $(options.container).append('<div class="panel ' + selector + ' ' + uniqueSelector + '"></div>');
      el = $(uniqueSelector);

    }

    function run(_image, onComplete, options) {

      options = options || {};
      options.format = options.format || "jpg";

      // is global necessary? this is for browsers only
      //global.Buffer = require('buffer');

      var getPixels = require("get-pixels"),
          savePixels = require("save-pixels"),
          base64 = require('base64-stream');

      getPixels(_image.src, function(err, pixels) {

        if(err) {
          console.log("Bad image path")
          return
        }

        // iterate through pixels
        for(var x = 1; x < pixels.shape[0]; x++) {
          for(var y = 1; y < pixels.shape[1]; y++) {

            // set each channel r, g, b, a
            pixels.set(x, y, 0, pixels.get(x, y, 0));
            pixels.set(x, y, 1, pixels.get(x, y, 0));
            pixels.set(x, y, 2, pixels.get(x, y, 0));
            pixels.set(x, y, 3, pixels.get(x, y, 3));

          }
        }

        var buffer = base64.encode();
        savePixels(pixels, options.format)
          .pipe(buffer)

// so this line needs time to run asynchronously. Look into how stream callbacks work, or if we can chain a .something(function(){}) to do the rest

pix = buffer;
        var image = new Image();

/*
// these two won't work if run on the same line -- something needs to load
imageboard.steps[1].module.run(imageboard.steps[0].module.get());
$('.panel').last().html('<img src="data:image/jpeg;base64,'+pix.read().toString()+'" />')
*/


// asynchronicity problem;
// this doesn't work, what's a real event: 
        buffer.on('write', function() {

          image.src = buffer.read().toString();
 
    console.log(image)
          el.html(image)
          if (onComplete) onComplete(image);

        });


      });

    }

    return {
      title: "Pass through",
      run: run,
      setup: setup,
      image: image
    }
  }

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
