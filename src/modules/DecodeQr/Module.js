/*
 * Decodes QR from a given image.
 */
module.exports = function DoNothing(options) {
  options = options || {};
  options.title = "Decode QR Code";
  var output;
  var jsQR = require('jsqr');
  var getPixels = require('get-pixels');

  function draw(input,callback) {
    var this_ = this;
    getPixels(input.src,function(err,pixels){
      if(err) throw err;
      var w = pixels.shape[0];
      var h = pixels.shape[1];
      var decoded = jsQR.decodeQRFromImage(pixels.data,w,h);
      this_.output = input;
      this_.output.data = decoded;
      callback();
    });
  }

  return {
    options: options,
    draw: draw,
    output: output
  }
}
