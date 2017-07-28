function LoadImage(ref, name, src) {
  function CImage(src) {
    var datauri = (ref.options.inBrowser || src.substring(0,11) == "data:image/")?(src):require('urify')(src);
    var image = {
      src: datauri,
      format: datauri.split(':')[1].split(';')[0].split('/')[1]
    }
    return image;
  }

  function loadImage(name, src) {
    var step = {
      name: "load-image",
      ID: ref.options.sequencerCounter++,
      imageName: name,
      inBrowser: ref.options.inBrowser,
      ui: ref.options.ui
    };

    var image = {
      src: src,
      steps: [{
        options: {
          id: step.ID,
          name: "load-image",
          title: "Load Image",
          step: step
        },
        UI: ref.events,
        draw: function() {
          UI.onDraw(options.step);
          if(arguments.length==1){
            this.output = CImage(arguments[0]);
            options.step.output = this.output;
            UI.onComplete(options.step);
            return true;
          }
          else if(arguments.length==2) {
            this.output = CImage(arguments[0]);
            options.step.output = this.output;
            arguments[1]();
            UI.onComplete(options.step);
            return true;
          }
          return false;
        },
        output: CImage(src)
      }]
    };
    ref.images[name] = image;
    loadImageStep = ref.images[name].steps[0];
    loadImageStep.options.step.output = loadImageStep.output.src;
    loadImageStep.UI.onSetup(loadImageStep.options.step);
    loadImageStep.UI.onDraw(loadImageStep.options.step);
    loadImageStep.UI.onComplete(loadImageStep.options.step);
  }

  return loadImage(name,src);
}

module.exports = LoadImage;
