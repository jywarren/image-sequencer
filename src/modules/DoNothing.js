/*
 * Demo Module. Does nothing.
 */
module.exports = function DoNothing(options) {
  options = options || {};
  options.title = "Do Nothing";
  this_ = this;
  var output

  function draw(input,callback) {
    this.output = input;
    callback();
  }

  return {
    options: options,
    draw: draw,
    output: output
  }
}
