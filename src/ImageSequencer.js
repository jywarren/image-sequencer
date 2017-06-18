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
      for (i in images) {
        lastimage = i;
      }
      for (var arg in arguments) {
        args.push(copy(arguments[arg]));
      }
      if (args.length == 1) {
        if(objTypeOf(args[0]) == "Object") //addSteps(JSON)
          json_q = arguments[0];
        else { //addSteps(name) => addSteps([image],[name])
          args.splice(0,0,[]);
          for (img in images) args[0].push(img);
        }
      }
      if (args.length == 2) {
        //addSteps(name,o) => addSteps([image],[name],o)
        if (objTypeOf(args[1])=="Object") {
          args.splice(0,0,[]);
          for (img in images) args[0].push(img);
        }
        else { //addSteps(image,name) => addSteps([image],[name],o)
          args[2] = {};
        }
      }
      if (args.length == 3) { //addSteps(image,name,o) => addSteps(JSON)
        args[0] = makeArray(args[0]);
        args[1] = makeArray(args[1]);
        for (img in args[0]) {
          json_q[args[0][img]] = [];
          for (step in args[1]) {
            json_q[args[0][img]].push({
              name: args[1][step],
              o: args[2]
            });
          }
        }
      }
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
    this_ = this;
    args = [];
    for(var arg in arguments) args.push(copy(arguments[arg]));
    json_q = {};

    if(args.length==1) {
      if (objTypeOf(args[0])=="Object") { //removeSteps(JSON)
        json_q = args[0];
      }
      else { //removeSteps(index) => removeSteps([image],[index])
        args.splice(0,0,[]);
        for(img in images) args[0].push(img);
      }
    }
    if(args.length==2) { //removeSteps(image,index) => removeSteps(JSON)
      args[0] = makeArray(args[0]);
      args[1] = makeArray(args[1]);
      for(img in args[0]) {
        json_q[args[0][img]] = args[1];
      }
    }
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

    if (arguments.length==2 || arguments.length==3) {
      if (typeof(arguments[0])=="number") {
        if (typeof(arguments[1])=="string" || objTypeOf(arguments[1])=="Array") {
          var p = arguments[0];
          var m = arguments[1];
          var o = arguments[2];
          arguments = [];
          arguments[0] = {};
          for (image in this_.images) {
            arguments[0][image] = {
              index: p,
              name: m,
              o: o
            };
          }
        }
      } // end if argument is string
    }
    if(arguments.length==4 || arguments.length==3) {
      o = o || {};
      size = this_.images[image].steps.length;
      index = (index==size)?index:index%size;
      if (index<0) index += size+1;
      insertStep(image,index,name, o);
      run[image] = index;
    }
    else if(arguments.length==1) {
      if (objTypeOf(arguments[0])=='Object') {
        for (img in arguments[0]) {
          var details = arguments[0][img];
          if (objTypeOf(details) == "Object") {
            details = makeArray(details);
          }
          if (objTypeOf(details) == "Array") {
            details = details.sort(function(a,b){return b.index-a.index});
            for (i in details) {
              size = this_.images[img].steps.length;
              details[i].index = (details[i].index==size)?details[i].index:details[i].index%size;
              if (details[i].index<0) details[i].index += size+1;
              insertStep(img,details[i].index,details[i].name,details[i].o);
            }
            run[img] = details[details.length-1].index;
          }
        }
      } // end if argument is object
    }

    // this.run(run); // This is Creating issues
  }

  function run(t_image,t_from) {
    log('\x1b[32m%s\x1b[0m',"Running the Sequencer!");
    this_ = this;
    json_q = {};
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
    if (arguments.length == 0) {
      for (image in images)
        json_q[image] = 1;
    }
    else if (arguments.length == 1) {
      if (typeof(arguments[0]) == "string")
        json_q[arguments[0]] = 1;
      else if (typeof(arguments[0]) == "number")
        for (image in images)
          json_q[image] = arguments[0];
      else if (objTypeOf(arguments[0]) == "Array")
        for (image in arguments[0])
          json_q[arguments[0][image]] = 1;
      else if (objTypeOf(arguments[0]) == "Object")
        json_q = arguments[0];
    }
    else if (arguments.length == 2) {
      json_q[t_image] = t_from;
    }
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
