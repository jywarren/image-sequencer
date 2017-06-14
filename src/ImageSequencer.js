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

  var image,
      steps = [],
      modules = require('./Modules'),
      images = {};

  // if in browser, prompt for an image
  // if (options.imageSelect || options.inBrowser) addStep('image-select');
  // else if (options.imageUrl) loadImage(imageUrl);

  function addStep(image, name, o) {
    log('\x1b[36m%s\x1b[0m','adding step \"' + name + '\" to \"' + image + '\".');

    o = o || {};
    o.id = options.sequencerCounter++; //Gives a Unique ID to each step
    o.name = o.name || name;
    o.selector = o.selector || 'ismod-' + name;
    o.container = o.container || options.selector;
    o.image = image;

    var module = modules[name](o);
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
            json_q[i] = (argtype[0]=="Array")?arguments[0]:[arguments[0]];
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

    if(arguments.length==2) {
      removeStep(image,index);
      run[image] = index;
    }
    else if(arguments.length==1) {
      if (typeof(arguments[0])=="number" || objTypeOf(arguments[0])=="Array") {
        indx = arguments[0];
        arguments[0] = {};
        for (img in this_.images) arguments[0][img] = indx;
      }
      if (objTypeOf(arguments[0])=='Object') {
        for (img in arguments[0]) {
          var indexes = arguments[0][img];
          if (typeof(indexes) == "number")
            {removeStep(img,indexes); run[img]=indexes;}
          else if (objTypeOf(indexes) == "Array") {
            indexes = indexes.sort(function(a,b){return b-a});
            run[img] = indexes[indexes.length-1];
            for (i in indexes)
              removeStep(img,indexes[i]);
          }
        }
      } // end if argument is object
    }

    this.run(run)
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
            size = this_.images[img].steps.length;
            details.index = (details.index==size)?details.index:details.index%size;
            if (details.index<0) details.index += size+1;
            insertStep(img,details.index,details.name,details.o);
            run[img]=details.index;
          }
          else if (objTypeOf(details) == "Array") {
            details = details.sort(function(a,b){return b.index-a.index});
            run[img] = details[details.length-1].index;
            for (i in details) {
              size = this_.images[img].steps.length;
              details[i].index = (details[i].index==size)?details[i].index:details[i].index%size;
              if (details[i].index<0) details[i].index += size+1;
              insertStep(img,details[i].index,details[i].name,details[i].o);
            }
          }
        }
      } // end if argument is object
    }

    this.run(run)
  }

  function run(t_image,t_from) {
    log('\x1b[32m%s\x1b[0m',"Running the Sequencer!");
    this_ = this;
    runimg = {};
    json_q = {};
    for (image in images) {
      runimg[image] = 0;
    }
    function drawStep(drawarray,pos) {
      if(pos>=drawarray.length) return true;
      image = drawarray[pos].image;
      i = drawarray[pos].i;
      images[image].steps[i].draw.call(this_,function(){
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
