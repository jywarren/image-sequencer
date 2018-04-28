/*
 * Display only one color channel
 */
module.exports = function Channel(options,UI) {

  options = options || {};
  options.channel = options.channel || "green";

  // Tell UI that a step has been set up
  UI.onSetup(options.step);
  var output;

  function draw(input,callback,progressObj) {

    progressObj.stop(true);
    progressObj.overrideFlag = true;

    // Tell UI that a step is being drawn
    UI.onDraw(options.step);
    var step = this;

    function changePixel(r, g, b, a) {
      if (options.channel == "red")   return [r, 0, 0, a];
      if (options.channel == "green") return [0, g, 0, a];
      if (options.channel == "blue")  return [0, 0, b, a];
    }

    function output(image,datauri,mimetype){

      // This output is accesible by Image Sequencer
      step.output = {src:datauri,format:mimetype};

      // This output is accessible by UI
      options.step.output = datauri;

      // Tell UI that step ahs been drawn
      UI.onComplete(options.step);
    }

    return require('../_nomodule/PixelManipulation.js')(input, {
      output: output,
      changePixel: changePixel,
      format: input.format,
      image: options.image,
      inBrowser: options.inBrowser,
      callback: callback
    });

  }

  return {
    options: options,
    //setup: setup, // optional
    draw:  draw,
    output: output,
    UI: UI
  }
}
