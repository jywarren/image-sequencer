/*
* Resolves Fisheye Effect
*/
module.exports = function DoNothing(options, UI) {

  var defaults = require('./../../util/getDefaults.js')(require('./info.json'));

  var output;
  var fx = require('glfx');

  var dataURItoBlob = function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  };

  var canvasToBlobUrl = function canvasToBlobUrl(canvas) {

    var blob = dataURItoBlob(canvas.toDataURL('image/png'));
    return window.URL.createObjectURL(blob);

  };

  var warpWebGl = function warpWebGl(id, matrix1, matrix2, download) {

    // try to create a WebGL canvas (will fail if WebGL isn't supported)
    try {
      var canvas = fx.canvas(1500, 1500);
    } catch (e) {
      alert(e);
      return;
    }

    // convert the image to a texture
    var imageEl = document.getElementById(id);

    var image = new Image();

    image.onload = function() {

      var texture = canvas.texture(image);

      // var bbox1 = {
      //     nw: {
      //       x: matrix1[0],
      //       y: matrix1[1]
      //     },
      //     ne: {
      //       x: matrix1[2],
      //       y: matrix1[3]
      //     },
      //     se: {
      //       x: matrix1[4],
      //       y: matrix1[5]
      //     },
      //     sw: {
      //       x: matrix1[6],
      //       y: matrix1[7]
      //     }
      //   },
      //   bbox2 = {
      //     nw: {
      //       x: matrix2[0],
      //       y: matrix2[1]
      //     },
      //     ne: {
      //       x: matrix2[2],
      //       y: matrix2[3]
      //     },
      //     se: {
      //       x: matrix2[4],
      //       y: matrix2[5]
      //     },
      //     sw: {
      //       x: matrix2[6],
      //       y: matrix2[7]
      //     }
      //   };

      var matrix1Xs = [],
        matrix1Ys = [];

      for (let i = 0; i < matrix1.length; i += 2) {
        matrix1Xs.push(matrix1[i]);
      }

      for (let i = 1; i < matrix1.length; i += 2) {
        matrix1Ys.push(matrix1[i]);
      }

      var matrix1northmost = Math.min.apply(null, matrix1Ys);
      matrix1southmost = Math.max.apply(null, matrix1Ys);
      matrix1westmost = Math.min.apply(null, matrix1Xs);
      matrix1eastmost = Math.max.apply(null, matrix1Xs);

      var matrix2Xs = [],
        matrix2Ys = [];

      for (let i = 0; i < matrix2.length; i += 2) {
        matrix2Xs.push(matrix2[i]);
      }

      for (let i = 1; i < matrix2.length; i += 2) {
        matrix2Ys.push(matrix2[i]);
      }

      var matrix2northmost = Math.min.apply(null, matrix2Ys);
      matrix2southmost = Math.max.apply(null, matrix2Ys);
      matrix2westmost = Math.min.apply(null, matrix2Xs);
      matrix2eastmost = Math.max.apply(null, matrix2Xs);

      var offsetX = matrix2westmost - matrix1westmost;
      var offsetY = matrix2northmost - matrix1northmost;

      canvas.draw(texture,
        image.width, //  * ratio,
        image.height// * ratio
      );

      var ratioY = (matrix2southmost - matrix2northmost)
        / (matrix1southmost - matrix1northmost);

      var ratioX = (matrix2eastmost - matrix2westmost)
        / (matrix1eastmost - matrix1westmost);

      var ratio = Math.max(ratioX, ratioY);

      // stretch output matrix x to fix:
      for (var i = 0; i < matrix2.length; i += 2) {
        matrix2[i] -= offsetX;
        matrix2[i] /= ratio;
      }

      // stretch output matrix y to fix:
      for (let i = 1; i < matrix2.length; i += 2) {
        matrix2[i] -= offsetY;
        matrix2[i] /= ratio;
      }

      canvas.perspective(matrix1, matrix2).update();

      // replace the image with the canvas
      // image.parentNode.insertBefore(canvas, image);
      // image.parentNode.removeChild(image);

      var burl = canvasToBlobUrl(canvas);

      if (download) {

        window.open(burl);

      } else { // replace the image

        // keep non-blob version in case we have to fall back:
        // image.src = canvas.toDataURL('image/png');
        // window.location = canvas.toDataURL('image/png');
        imageEl.src = burl;

      }

    };

    image.src = imageEl.src;

  };

  function draw(input, callback) {

    var step = this;

    options.nw = options.nw || defaults.nw;
    options.ne = options.ne || defaults.ne;
    options.se = options.se || defaults.se;
    options.sw = options.sw || defaults.sw;

    var parseDistortCoordinates = require('../../util/parseDistortCoordinates.js');
    var cornerCoordinates = parseDistortCoordinates(options);

    if (!options.inBrowser) {
      // this.output = input;
      // callback();
      require('../_nomodule/gl-context')(input, callback, step, options);
    }
    else {
      var image = document.createElement('img');
      image.onload = () => {
        warpWebGl(
          'img',
          [0, 0, image.naturalWidth, 0, image.naturalWidth, image.naturalHeight, 0, image.naturalHeight], // matrix 1 (before) corner coordinates, NW, NE, SE, SW
          // [0, 100, 1023, -50, 1223, 867, 100, 767]  // matrix 2 (after) corner coordinates
          cornerCoordinates
        );
        image.onload = () => {
          var canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth; // or 'width' if you want a special/scaled size
          canvas.height = image.naturalHeight; // or 'height' if you want a special/scaled size
          canvas.getContext('2d').drawImage(image, 0, 0);

          step.output = { src: canvas.toDataURL('image/png'), format: 'png' };
          image.remove();
          callback();
        };
      };
      image.src = input.src;
      image.id = 'img';
      document.body.appendChild(image);
    }
  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  };
};
