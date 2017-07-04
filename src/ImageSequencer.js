if (typeof window !== 'undefined') {window.$ = window.jQuery = require('jquery'); isBrowser = true}
else {window = global; var isBrowser = false}

ImageSequencer = function ImageSequencer(options) {

  options = options || {};
  options.inBrowser = options.inBrowser || isBrowser;
  // if (options.inBrowser) options.ui = options.ui || require('./UserInterface');
  options.sequencerCounter = 0;

  function objTypeOf(object){
    return Object.prototype.toString.call(object).split(" ")[1].slice(0,-1)
  }

  function clog(color,msg) {
    if(options.ui!="none") {
      if(arguments.length==1) console.log(arguments[0]);
      else if(arguments.length==2) console.log(color,msg);
    }
  }

  function copy(a) {
    if (!typeof(a) == "object") return a;
    if (objTypeOf(a) == "Array") return a.slice();
    if (objTypeOf(a) == "Object") {
      var b = {};
      for (v in a) {
        b[v] = copy(a[v]);
      }
      return b;
    }
    return a;
  }

  function makeArray(input) {
    return (objTypeOf(input)=="Array")?input:[input];
  }

  formatInput = require('./FormatInput');

  var image,
      steps = [],
      modules = require('./Modules'),
      images = {},
      log = [];

  // if in browser, prompt for an image
  // if (options.imageSelect || options.inBrowser) addStep('image-select');
  // else if (options.imageUrl) loadImage(imageUrl);

  function addSteps(){
      args = [];
      json_q = {};
      for(arg in arguments){args.push(copy(arguments[arg]));}
      json_q = formatInput.call(this,args,"+");
      log.push({method:"addSteps", json_q:copy(json_q)});
      for (i in json_q)
        for (j in json_q[i])
          require("./AddStep")(this,i,json_q[i][j].name,json_q[i][j].o);
    }

  function removeStep(image,index) {
    //remove the step from images[image].steps and redraw remaining images
    if(index>0) {
      clog('\x1b[31m%s\x1b[0m',"Removing "+index+" from "+image);
      images[image].steps.splice(index,1);
    }
    //tell the UI a step has been removed
  }

  function removeSteps(image,index) {
    run = {};
    args = [];
    for(arg in arguments) args.push(copy(arguments[arg]));
    json_q = formatInput.call(this,args,"-");
    log.push({method:"removeSteps", json_q:copy(json_q)});

    for (img in json_q) {
      indices = json_q[img].sort(function(a,b){return b-a});
      run[img] = indices[indices.length-1];
      for (i in indices)
        removeStep(img,indices[i]);
    }
    // this.run(run); // This is creating problems
  }

  function insertSteps(image, index, name, o) {
    run = {};
    this_ = this;
    args = [];
    for (arg in arguments) args.push(arguments[arg]);

    json_q = formatInput.call(this,args,"^");
    log.push({method:"insertSteps", json_q:copy(json_q)});

    for (img in json_q) {
      var details = json_q[img];
      details = details.sort(function(a,b){return b.index-a.index});
      for (i in details)
        require("./InsertStep")(this,img,details[i].index,details[i].name,details[i].o);
      // run[img] = details[details.length-1].index;
    }
    // this.run(run); // This is Creating issues
  }

  function run(t_image,t_from) {
    clog('\x1b[32m%s\x1b[0m',"Running the Sequencer!");
    this_ = this;
    args = [];
    for (var arg in arguments) args.push(copy(arguments[arg]));
    callback = function() {};
    for (var arg in args)
      if(objTypeOf(args[arg]) == "Function")
        callback = args.splice(arg,1)[0];

    json_q = formatInput.call(this,args,"r");

    require('./Run')(this, json_q, callback);
  }

  function loadImages() {
    args = [];
    for (arg in arguments) args.push(copy(arguments[arg]));
    json_q = formatInput.call(this,args,"l");
    json_q_push = copy(json_q);
    delete json_q_push.callback;
    log.push({method:"loadImages", json_q:json_q_push});

    for (i in json_q.images)
      require('./LoadImage')(this,i,json_q.images[i])

    if (json_q.callback) json_q.callback();
  }

  function runLog() {
    for(i in sequencer.log)
      eval("sequencer."+sequencer.log[i].method).call(sequencer,sequencer.log[i].json_q);
    return true
  }

  return {
    options: options,
    loadImages: loadImages,
    addSteps: addSteps,
    removeSteps: removeSteps,
    insertSteps: insertSteps,
    run: run,
    log: log,
    modules: modules,
    images: images,
    ui: options.ui,
    clog: clog,
    objTypeOf: objTypeOf,
    copy: copy,
    runLog: runLog
  }

}
module.exports = ImageSequencer;
