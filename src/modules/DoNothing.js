/*
 * Demo Module. Does nothing.
 */
module.exports = function DoNothing(options) {
  options = options || {};
  options.title = "Do Nothing";

  var image;
  var output;

  function draw() {
    thisimage = this.images[options.image];
    for (i in thisimage.steps){
      if (thisimage.steps[i].options.id == options.id) pos = i;
    }
    olddata = thisimage.steps[i-1].output;
    var newdata = JSON.parse(JSON.stringify(olddata));
    thisimage.steps[i].output = {src:newdata.src,mimeType:newdata.mimeType};
  }

  function get() {
    return image;
  }

  return {
    options: options,
    draw: draw,
    get: get,
    output: output
  }
}
