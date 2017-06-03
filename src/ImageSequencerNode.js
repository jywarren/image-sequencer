if (typeof window !== 'undefined') {window.$ = window.jQuery = require('jquery'); isBrowser = true}
else {window = global; var isBrowser = false}

ImageSequencer = function ImageSequencer(options) {

  options = options || {};
  options.inBrowser = options.inBrowser || isBrowser;
  // if (options.inBrowser) options.ui = options.ui || require('./UserInterface');
  options.sequencerCounter = 0;

  function CImage(src) {
    datauri = (options.inBrowser)?(src):require('urify')(src);
    image = {
      src: datauri,
      mimeType: datauri.split(':')[1].split(';')[0]
    }
    return image;
  }

  var image,
      steps = [],
      modules = require('./ModulesNode'),
      images = {};

  // if in browser, prompt for an image
  // if (options.imageSelect || options.inBrowser) addStep('image-select');
  // else if (options.imageUrl) loadImage(imageUrl);

  // soon, detect local or URL?
  function addStep(image, name, o) {
    console.log('\x1b[36m%s\x1b[0m','adding step \"' + name + '\" to \"' + image + '\".');

    o = o || {};
    o.id = options.sequencerCounter++; //Gives a Unique ID to each step
    o.name = o.name || name;
    o.selector = o.selector || 'ismod-' + name;
    o.container = o.container || options.selector;
    o.image = image;

    var module = modules[name](o);
    images[image].steps.push(module);

    function defaultSetupModule() {
      if (options.ui) module.options.ui = options.ui({
        selector: o.selector,
        title: module.options.title,
        id: o.id
      });
    }
    if (module.hasOwnProperty('setup')) module.setup(); // add a default UI, unless the module has one specified
    else defaultSetupModule.apply(module); // run default setup() in scope of module (is this right?)

    // run the draw method.
    module.draw.call(this);

    // tell the UI that a step has been added.

    return true;
  }

  function objTypeOf(object){
    return Object.prototype.toString.call(object).split(" ")[1].slice(0,-1)
  }

  function addSteps(){
      argtype = [];
      json_q = {};
      for (i in images) {
        lastimage = i;
      }
      for (var arg in arguments) {
        argtype.push(objTypeOf(arguments[arg]));
      }
      if (arguments.length == 1) {
        if(argtype[0] == "Object")
          json_q = arguments[0];
        else
          for (i in images)
            json_q[i] = [arguments[0]];
      }
      else if (arguments.length == 2) {
        if(argtype[1]=="String") arguments[1] = [arguments[1]];
        if(argtype[0]=="String")
          json_q[arguments[0]] = arguments[1];
        else if(argtype[0]=="Array")
          for (var i in arguments[0]) {
            json_q[arguments[0][i]] = arguments[1];
          }
      }
      for (i in json_q)
        for (j in json_q[i])
          addStep.call(this,i,json_q[i][j]);

    }

  function removeStep(image,index) {
    for (i=0;i<steps.length;i++) {
      if (steps[i].options.id == id && steps[i].options.name != 'image-select'){
        console.log('\x1b[36m%s\x1b[0m','removing step "'+steps[i].options.name+'"');
        // if (options.inBrowser) steps[i].options.ui.remove();
        steps.splice(i,1);
        if (steps.length != 0)
          run(options.initialImage);
      }
    }
    return "Removed.";
  }

  function removeSteps() {
    if(arguments.length==1) {

    }
  }

  function run() {
    if (arguments.length == 0)
      for (image in images) {
        for (i in images[image].steps)
          images[image].steps[i].draw.call(this);
      }
    else if (objTypeOf[arguments[0]]=="Array")
      for (image in arguments[0]) {
        for (i in images[image].steps)
          images[image].steps[i].draw.call(this);
      }
    else if (objTypeOf(arguments[0])=="String" && (image = arguments[0])) {
      for (i in images[image].steps)
        images[image].steps[i].draw.call(this);
    }
  }

  function log(msg) {
    console.log(msg);
  }

  function loadImage(name, src, callback) {
    image = {
      src: src,
      steps: [{
        options: {
          id: options.sequencerCounter++,
          name: "load-image",
          title: "Load Image"
        },
        draw: function() {
          if(arguments.length==1){
            this.outputData = CImage(arguments[0]);
            return true;
          }
          return false;
        },
        output: CImage(src)
      }]
    };
    images[name] = image;
    if (callback) callback();
  }

  return {
    options: options,
    loadImage: loadImage,
    addSteps: addSteps,
    removeSteps: removeSteps,
    run: run,
    modules: modules,
    steps: steps,
    images: images,
    ui: options.ui
  }

}

module.exports = ImageSequencer;
