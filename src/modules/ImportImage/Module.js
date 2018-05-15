/*
 * Import Image module
 */
module.exports = function ImportImageModule(options, UI) {

  options = options || {};
  options.imageUrl = options.imageUrl || "/examples/images/monarch.png";

  var output,
      imgObj = new Image();

  // Tell the UI that a step has been added
  UI.onSetup(options.step); // we should get UI to return the image thumbnail so we can attach our own UI extensions

  // add our custom in-module html ui:
  if (options.step.inBrowser) {
    var ui = require('./Ui.js')(options.step, UI);
    ui.setup();
  }

  // This function is caled everytime the step has to be redrawn
  function draw(input,callback) {

    // Tell the UI that the step has been triggered
    UI.onDraw(options.step);
    var step = this;

    // save the input image; 
    //options.step.input = input.src;

    function onLoad() {

      // This output is accessible to Image Sequencer
      step.output = {
        src: imgObj.src,
        format: require('../../util/GetFormat')(imgObj.src)
      }

      // This output is accessible to the UI
      options.step.output = imgObj.src;
 
      // Tell the UI that the step has been drawn
      UI.onComplete(options.step);

      // Tell Image Sequencer that step has been drawn
      callback();
    }

    imgObj.onload = onLoad;
    imgObj.src = options.imageUrl;

  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
