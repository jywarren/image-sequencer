window.$ = window.jQuery = require('jquery');

ImageSequencer = function ImageSequencer(options) {

  options = options || {};
  options.defaultSteps = options.defaultSteps || function defaultSteps() {
    addStep('image-select');
  }

  var image,
      steps = [],
      modules = require('./Modules');

  options.ui = options.ui || require('./UserInterface')();

  options.defaultSteps();

  function addStep(name, o) {
    console.log('adding step "' + name + '"');

    o = o || {};
    o.container = o.container || options.selector;
    o.createUserInterface = o.createUserInterface || options.ui.create;

    var module = modules[name](o);

    steps.push(module);

    if (steps.length > 1) {
 
      if (module.setup) module.setup();

      var lastStep = steps[steps.length - 2];
 
      // connect last step to input of this step
      lastStep.options.onComplete = function onComplete(_image) {
        log('running module "' + name + '"');
        if (lastStep.options.ui) lastStep.options.ui.el.html(_image);
        module.draw(_image);
      }

      module.options.onComplete = function onComplete(_image) {
        if (module.options.ui) module.options.ui.el.html(_image);
      }

    } else {

      module.setup(); // just set up initial ImageSelect

    }
  }

  function log(msg) {
    $('.log').append(msg + ' at ' + new Date());
    console.log(msg);
  }

  function run() {

    steps[0].draw();

  }

  // load default starting image
  // i.e. from parameter
  // this could send the image to ImageSelect, or something?
// not currently working
  function loadImage(src, callback) {

    image = new Image();

    image.onload = function() {
      run();
      if (callback) callback(image);
    }

    image.src = src;

  }

  return {
    loadImage: loadImage,
    addStep: addStep,
    run: run,
    modules: modules,
    steps: steps,
    ui: options.ui
  }

}

module.exports = ImageSequencer;
