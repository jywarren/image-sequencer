/*
 * Demo Module. Does nothing.
 */
module.exports = function DoNothing(options) {
  options = options || {};
  options.title = "Do Nothing";

  var image;
  var output;

  function draw(callback) {
    step = require('./_Step')(this,options);
    newdata = step[0];
    pos = step[1];
    thisimage.steps[pos].output = {src:newdata.src,format:newdata.format};
    callback();
  }

  function get() {
    return image;
  }

  return {
    options: options,
    draw: draw,
    get: get,
    output: output
  }
}
