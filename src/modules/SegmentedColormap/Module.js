module.exports = function SegmentedColormap(options,UI) {

  options = options || {};
  options.title = "Segmented Colormap";
  UI.setup();
  var output;

  function draw(input,callback) {

    UI.drawing();
    var this_ = this;

    function changePixel(r, g, b, a) {
      var ndvi = (b - r) / (r + b);
      var normalized = (ndvi + 1) / 2;
      var res = require('./SegmentedColormap')(normalized,options);
      return [res[0], res[1], res[2], 255];
    }
    function output(image,datauri,mimetype){
      this_.output = {src:datauri,format:mimetype};
      UI.drawn(datauri);
    }
    return require('../_nomodule/PixelManipulation.js')(input, {
      output: output,
      changePixel: changePixel,
      format: input.format,
      image: options.image,
      callback: callback
    });

  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
