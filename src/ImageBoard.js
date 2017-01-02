ImageBoard = function ImageBoard(options) {

  options = options || {};
  options.container = options.container || '.panels';

  var image;
  var modules = require('./Modules');
  var steps = [];

  function addStep(name, stepOptions) {
    steps.push({
      module: modules[name]({
        container: options.container // this is a bit redundant
      }),
      options: stepOptions
    });
    steps[steps.length - 1].module.setup();
  }

  addStep('image-select');

  function setup() {

    steps.forEach(function forEachStep(step, index) {

      if (step.module.setup) step.module.setup();

    });

  }

  setup();

  // need prev() next() functions

  function run() {

    steps.forEach(function forEachStep(step) {

      // step.module.run(onComplete);// initial image

    });

    // return image;

  }

  // load default starting image
  // i.e. from parameter
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
    steps: steps
  }

}
