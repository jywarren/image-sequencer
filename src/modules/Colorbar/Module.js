module.exports = function Colorbar(options, UI) {

  var defaults = require('./../../util/getDefaults.js')(require('./info.json'));
  var output;

  options.x = options.x || defaults.x;
  options.y = options.y || defaults.y;
  options.colormap = options.colormap || defaults.colormap;
  options.h = options.h || defaults.h;

console.log('added colorbar 13');
  var steps = [
    { 'name': 'gradient', 'options': {} },
    { 'name': 'colormap', 'options': { colormap: options.colormap } },
    { 'name': 'crop', 'options': { 'y': 0, 'h': options.h } },
    { 'name': 'overlay', 'options': { 'x': options.x, 'y': options.y, 'offset': -4 } }
  ];

  var internalSequencer = ImageSequencer();
console.log('colorbar setup is', internalSequencer);

  function draw(input,callback) {

    var step = this;
console.log('colorbar draw', input);

    internalSequencer.addImage(input.src, function onAddImage() {
      internalSequencer.importJSON(steps);
      internalSequencer.run(function onCallback(internalOutput) {
        step.output = { src: internalOutput, format: input.format };
        callback();
      });
    });

  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
