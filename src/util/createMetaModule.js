module.exports = function createMetaModule(mapFunction, moduleOptions){

  moduleOptions = moduleOptions || {};
  moduleOptions.infoJson = moduleOptions.infoJson || 'info.json';

  function MetaModule(options, UI) {

    var defaults = require('./getDefaults.js')(require(moduleOptions.infoJson));
    var output;

    // map inputs to internal step options;
    // use this to set defaults for internal steps
    // and to expose internal settings as external meta-module parameters;
    // it must return a steps object
    var steps = mapFunction(options, defaults);

    /* example:
    function mapFunction(opt, _defaults) { 
      opt.x = opt.x || _defaults.x;
      opt.y = opt.y || _defaults.y;
      opt.colormap = opt.colormap || _defaults.colormap;
      opt.h = opt.h || _defaults.h;
 
      // return steps with options: 
      return [
        { 'name': 'gradient', 'options': {} },
        { 'name': 'colormap', 'options': { colormap: options.colormap } },
        { 'name': 'crop', 'options': { 'y': 0, 'h': options.h } },
        { 'name': 'overlay', 'options': { 'x': options.x, 'y': options.y, 'offset': -4 } }
      ];
    }
    */
 
    // ui: false prevents internal logs
    var internalSequencer = ImageSequencer({ inBrowser: false, ui: false });
 
    function draw(input, callback) {
 
      var step = this;
 
      internalSequencer.loadImage(input.src, function onAddImage() {
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

  return MetaModule;
}
