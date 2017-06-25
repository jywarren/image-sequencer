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
      format: datauri.split(':')[1].split(';')[0].split('/')[1]
    }
    return image;
  }

  function objTypeOf(object){
    return Object.prototype.toString.call(object).split(" ")[1].slice(0,-1)
  }

  function log(color,msg) {
    if(options.ui!="none") {
      if(arguments.length==1) console.log(arguments[0]);
      else if(arguments.length==2) console.log(color,msg);
    }
  }

  function copy(a) {
    if (!typeof(a) == "object") return a;
    if (objTypeOf(a) == "Array") return a.slice();
    if (objTypeOf(a) == "Object") return JSON.parse(JSON.stringify(a));
    return a;
  }

  function makeArray(input) {
    return (objTypeOf(input)=="Array")?input:[input];
  }

  formatInput = require('./FormatInput');

  var image,
      steps = [],
      modules = require('./Modules'),
      images = {};

  // if in browser, prompt for an image
  // if (options.imageSelect || options.inBrowser) addStep('image-select');
  // else if (options.imageUrl) loadImage(imageUrl);

  function addStep(image, name, o_) {
    log('\x1b[36m%s\x1b[0m','adding step \"' + name + '\" to \"' + image + '\".');

    o = {};
    o.id = options.sequencerCounter++; //Gives a Unique ID to each step
    o.name = o_.name || name;
    o.selector = o_.selector || 'ismod-' + name;
    o.container = o_.container || options.selector;
    o.image = image;

    var module = modules[name].call(this.images,o);
    images[image].steps.push(module);


    function defaultSetupModule() {
      if (options.ui && options.ui!="none") module.options.ui = options.ui({
        selector: o.selector,
        title: module.options.title,
        id: o.id
      });
    }
    if (module.hasOwnProperty('setup')) module.setup(); // add a default UI, unless the module has one specified
    else defaultSetupModule.apply(module); // run default setup() in scope of module (is this right?)

    // tell the UI that a step has been added.
    return true;
  }

  function addSteps(){
      args = [];
      json_q = {};
      for(arg in arguments){args.push(copy(arguments[arg]));}
      json_q = formatInput.call(this,args,"+");
      for (i in json_q)
        for (j in json_q[i])
          addStep.call(this,i,json_q[i][j].name,json_q[i][j].o);

    }

  function removeStep(image,index) {
    //remove the step from images[image].steps and redraw remaining images
    if(index>0) {
      log('\x1b[31m%s\x1b[0m',"Removing "+index+" from "+image);
      images[image].steps.splice(index,1);
    }
    //tell the UI a step has been removed

  }

  function removeSteps(image,index) {
    run = {};
    args = [];
    for(arg in arguments) args.push(copy(arguments[arg]));
    json_q = formatInput.call(this,args,"-");

    for (img in json_q) {
      indices = json_q[img].sort(function(a,b){return b-a});
      run[img] = indices[indices.length-1];
      for (i in indices)
        removeStep(img,indices[i]);
    }
    // this.run(run); // This is creating problems
  }

  function insertStep(image, index, name, o) {
    log('\x1b[36m%s\x1b[0m','inserting step \"' + name + '\" to \"' + image + '\" at \"'+index+'\".');

    o = o || {};
    o.id = options.sequencerCounter++; //Gives a Unique ID to each step
    o.name = o.name || name;
    o.selector = o.selector || 'ismod-' + name;
    o.container = o.container || options.selector;
    o.image = image;

    var module = modules[name](o);
    images[image].steps.splice(index, 0, module);

    function defaultSetupModule() {
      if (options.ui && options.ui!="none") module.options.ui = options.ui({
        selector: o.selector,
        title: module.options.title,
        id: o.id
      });
    }
    if (module.hasOwnProperty('setup')) module.setup(); // add a default UI, unless the module has one specified
    else defaultSetupModule.apply(module); // run default setup() in scope of module (is this right?)

    // tell the UI that a step has been inserted.

    return true;
  }

  function insertSteps(image, index, name, o) {
    run = {};
    this_ = this;
    args = [];
    for (arg in arguments) args.push(arguments[arg]);

    json_q = formatInput.call(this,args,"^");

    for (img in json_q) {
      var details = json_q[img];
      details = details.sort(function(a,b){return b.index-a.index});
      for (i in details)
        insertStep(img,details[i].index,details[i].name,details[i].o);
      // run[img] = details[details.length-1].index;
    }
    // this.run(run); // This is Creating issues
  }

  function run(t_image,t_from) {
    log('\x1b[32m%s\x1b[0m',"Running the Sequencer!");
    this_ = this;
    args = [];
    for (var arg in arguments) args.push(copy(arguments[arg]));
    for (var arg in args)
      if(objTypeOf(args[arg]) == "Function")
        var callback = args.splice(arg,1)[0];
    function drawStep(drawarray,pos) {
      if(pos==drawarray.length) if(objTypeOf(callback)=='Function') callback();
      if(pos>=drawarray.length) return true;
      image = drawarray[pos].image;
      i = drawarray[pos].i;
      input = images[image].steps[i-1].output;
      images[image].steps[i].draw(copy(input),function(){
        drawStep(drawarray,++pos);
      });
    }
    function drawSteps(json_q) {
      drawarray = [];
      for (image in json_q) {
        no_steps = images[image].steps.length;
        init = json_q[image];
        for(i = 0; i < no_steps-init; i++) {
          drawarray.push({image: image,i: init+i});
        }
      }
      drawStep(drawarray,0);
    }
    function filter(json_q){
      for (image in json_q) {
        if (json_q[image]==0 && this_.images[image].steps.length==1)
          delete json_q[image];
        else json_q[image]++;
      }
      for (image in json_q) {
        prevstep = images[image].steps[json_q[image]-1];
        while (typeof(prevstep) == "undefined" || typeof(prevstep.output) == "undefined") {
          prevstep = images[image].steps[(--json_q[image]) - 1];
        }
      }
      return json_q;
    }

    json_q = formatInput.call(this,args,"r");
    json_q = filter(json_q);
    drawSteps(json_q);
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

  function loadImages() {
    if (arguments.length == 1) {
      for (image in arguments[0])
        loadImage(image,arguments[0][image]);
    }
    else if (arguments.length == 2) {
      if (objTypeOf(arguments[1]) == "Function") {
        for (image in arguments[0]) {
          loadImage(image,arguments[0][image])
        }
        arguments[1]();
      }
      else {
        loadImage(arguments[0],arguments[1])
      }
    }
    else if (arguments.length == 3) {
      loadImage(arguments[0],arguments[1],arguments[2])
    }
  }

  return {
    options: options,
    loadImages: loadImages,
    addSteps: addSteps,
    removeSteps: removeSteps,
    insertSteps: insertSteps,
    run: run,
    modules: modules,
    images: images,
    ui: options.ui
  }

}

module.exports = ImageSequencer;
