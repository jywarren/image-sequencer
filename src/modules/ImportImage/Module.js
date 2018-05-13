/*
 * Import Image module
 */
module.exports = function ImportImageModule(options, UI) {

  options = options || {};
  options.imageUrl = options.imageUrl || "/examples/images/monarch.png";
//options.imageUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABykX//Z";
  var oldImageUrl,
      output,
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

console.log('onLoadInDraw')
      // This output is accessible to Image Sequencer
      step.output = {
        src: imgObj.src,
        format: options.format
      }

// not sure why we have to do this here and not apparently in other modules? 
// but not working...
console.log('output1',output);
      output = step.output;

      console.log('output',output);

      // This output is accessible to the UI
      options.step.output = imgObj.src;
 
      // Tell the UI that the step has been drawn
      UI.onComplete(options.step);

      // Tell Image Sequencer that step has been drawn
      callback();
    }

    if (oldImageUrl !== options.imageUrl) {
console.log('changed src', imgObj.src, options.step)
      imgObj.onload = onLoad;
      imgObj.src = options.imageUrl;
      oldImageUrl = options.imageUrl;
    } else {
console.log('didnt change src', imgObj.src, options.step)
      onLoad();
    }

  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
