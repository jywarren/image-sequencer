/*
 * Demo Module. Does nothing. Adds a step where output is equal to input.
 */
module.exports = function DoNothing(options,UI) {
  options = options || {};
  options.title = "Do Nothing";
  UI.setup();
  var output;

  function draw(input,callback) {
    UI.drawing();
    this.output = input;
    callback();
    UI.drawn(this.output.src);
  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
