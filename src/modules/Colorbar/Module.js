module.exports = require('../../util/createMetaModule.js')(
  function mapFunction(options, defaults) { 

    options.x = options.x || defaults.x;
    options.y = options.y || defaults.y;
    options.colormap = options.colormap || defaults.colormap;
    options.h = options.h || defaults.h;
 
    // return steps with options: 
    return [
      { 'name': 'gradient', 'options': {} },
      { 'name': 'colormap', 'options': { colormap: options.colormap } },
      { 'name': 'crop', 'options': { 'y': 0, 'h': options.h } },
      { 'name': 'overlay', 'options': { 'x': options.x, 'y': options.y, 'offset': -4 } }
    ];
  }
)
