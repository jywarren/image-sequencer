/*
 * Display only the green channel
 */
module.exports = function GreenChannel(options) {

  options = options || {};
  options.title = "Green channel only";
  options.description = "Displays only the green channel of an image";

  //function setup() {} // optional

  function draw(callback) {
    step = require('./_Step')(this,options);
    newdata = step[0];
    pos = step[1];
    function changePixel(r, g, b, a) {
      return [0, g, 0, a];
    }
    function output(image,datauri,mimetype){
      images[image].steps[pos].output = {src:datauri,format:mimetype}
    }
    return require('./PixelManipulation.js')(newdata, {
      output: output,
      changePixel: changePixel,
      format: newdata.format,
      image: options.image,
      callback: callback
    });
  }

  return {
    options: options,
    //setup: setup, // optional
    draw:  draw
  }
}
