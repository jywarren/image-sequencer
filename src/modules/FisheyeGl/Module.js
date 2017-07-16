/*
 * Creates Fisheye Effect
 */
module.exports = function DoNothing(options) {
  options = options || {};
  options.title = "Fisheye GL";
  var output

  function draw(input,callback) {
    this_ = this;
    if (!options.inBrowser) { // This module is only for browser
      this.output = input;
      callback();
    }
    else {

      if (!document.querySelector('#image-sequencer-canvas')) {
        var canvas = document.createElement('canvas');
        canvas.style.display = "none";
        canvas.setAttribute('id','image-sequencer-canvas');
        document.body.append(canvas);
      }

      distorter = require('./fisheyegl.js')({
        selector: "#image-sequencer-canvas"
      });

      distorter.lens.a = options.a || distorter.lens.a;
      distorter.lens.b = options.b || distorter.lens.b;
      distorter.lens.Fx = options.Fx || distorter.lens.Fx;
      distorter.lens.Fy = options.Fy || distorter.lens.Fy;
      distorter.lens.scale = options.scale || distorter.lens.scale;
      distorter.fov.x = options.x || distorter.fov.x;
      distorter.fov.y = options.y || distorter.fov.y;

      distorter.setImage(input.src,function(){
        this_.output = {src: canvas.toDataURL(), format: input.format};
        callback();
      });

    }
  }

  return {
    options: options,
    draw: draw,
    output: output
  }
}
