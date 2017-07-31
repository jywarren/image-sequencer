/*
 * Demo Module. Does nothing. Adds a step where output is equal to input.
 */
module.exports = function DoNothing(options,UI) {
  options = options || {};
  options.title = "Do Nothing";
  UI.onSetup(options.step);
  var output;

  function draw(input,callback) {
    UI.onDraw(options.step);

    this.output = input;

    options.step.output = this.output.src;
    callback();
    UI.onComplete(options.step);
  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
