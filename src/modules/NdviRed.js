/*
 * NDVI with red filter (blue channel is infrared)
 */
module.exports = function NdviRed(options) {

  options = options || {};
  options.title = "NDVI for red-filtered cameras (blue is infrared)";

  //function setup() {} // optional

  function draw(image) {
    images = this.images;
    thisimage = images[options.image];
    for (i in thisimage.steps){
      if (thisimage.steps[i].options.id == options.id) pos = i;
    }
    olddata = thisimage.steps[i-1].output;
    var newdata = JSON.parse(JSON.stringify(olddata));

    function changePixel(r, g, b, a) {
      var ndvi = 255 * (b - r) / (1.00 * b + r);
      return [ndvi, ndvi, ndvi, a];
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
    draw: draw
  }
}
