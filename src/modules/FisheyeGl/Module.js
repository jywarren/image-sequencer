/*
 * Creates Fisheye Effect
 */
module.exports = function DoNothing(options,UI) {
  options = options || {};
  options.title = "Fisheye GL";
  var output;
  UI.onSetup(options.step);
  require('fisheyegl');

  function draw(input,callback) {
    UI.onDraw(options.step);
    const step = this;
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
      else var canvas = document.querySelector('#image-sequencer-canvas');

      distorter = FisheyeGl({
        selector: "#image-sequencer-canvas"
      });

      distorter.lens.a = parseFloat(options.a) || distorter.lens.a;
      distorter.lens.b = parseFloat(options.b) || distorter.lens.b;
      distorter.lens.Fx = parseFloat(options.Fx) || distorter.lens.Fx;
      distorter.lens.Fy = parseFloat(options.Fy) || distorter.lens.Fy;
      distorter.lens.scale = parseFloat(options.scale) || distorter.lens.scale;
      distorter.fov.x = parseFloat(options.x) || distorter.fov.x;
      distorter.fov.y = parseFloat(options.y) || distorter.fov.y;

      distorter.setImage(input.src,function(){
        step.output = {src: canvas.toDataURL(), format: input.format};
        options.step.output = step.output.src;
        callback();
        UI.onComplete(options.step);
      });

    }
  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
