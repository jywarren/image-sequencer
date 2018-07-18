module.exports = function testModule(options, UI) {

  var output;
  function draw(input, callback) {

    var output = function(input) {
      return input;
    }

    this.output = output(input); // run the output and assign it to this.output
    callback();
  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}