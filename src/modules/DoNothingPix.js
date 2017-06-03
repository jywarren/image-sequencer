/*
 * Display only the green channel
 */
module.exports = function GreenChannel(options) {

  options = options || {};
  options.title = "Green channel only";
  options.description = "Displays only the green channel of an image";

  //function setup() {} // optional

  function draw() {
    images = this.images;
    thisimage = images[options.image];
    for (i in thisimage.steps){
      if (thisimage.steps[i].options.id == options.id) pos = i;
    }
    olddata = thisimage.steps[i-1].output;
    var newdata = JSON.parse(JSON.stringify(olddata));

    function changePixel(r, g, b, a) {
      return [r, g, b, a];
    }
    function output(image,datauri,mimetype){
      images[image].steps[i].output = {src:datauri,mimeType:mimetype}
    }
    return require('./PixelManipulation.js')(newdata, {
      output: output,
      changePixel: changePixel,
      format: newdata.mimeType.split('/')[1],
      image: options.image
    });
  }

  return {
    options: options,
    //setup: setup, // optional
    draw:  draw
  }
}
