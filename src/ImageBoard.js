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

  // by default, always begin with an ImageSelect module
  addStep('image-select');

  function setup() {

    steps.forEach(function forEachStep(step, index) {

      // different behavior for first step:
      var onComplete = (index !== 0) ? false : function (image) {
        run(image); // begin run on image selection
      }

      if (step.module.setup) step.module.setup(onComplete);

    });

  }

  setup();

  function log(msg) {
    $('.log').append(msg + ' at ' + new Date());
    console.log(msg);
  }

  function run() {

    var lastImage;

// THIS MUST BE EVENT BASED OR CALLBACKED -- ITS ASYNCHRONOUS
    steps.forEach(function forEachStep(step) {

      step.module.run(lastImage, function onComplete(image) {
        lastImage = image;
        log('completed step "' + step.module.title + '"');
      });

    });

    return lastImage;

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
