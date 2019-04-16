/*
 * Accepts a value from 0-255 and returns the new color-mapped pixel 
 * from a lookup table, which can be specified as an array of [begin, end] 
 * gradients, where begin and end are represented as [r, g, b] colors. In 
 * combination, a lookup table which maps values from 0 - 255 smoothly from black to white looks like:
 * [
 *   [0, [0, 0, 0], [255, 255, 255]],
 *   [1, [255, 255, 255], [255, 255, 255]]
 * ]
 * 
 * Adapted from bgamari's work in Infragram: https://github.com/p-v-o-s/infragram-js/commit/346c97576a07b71a55671d17e0153b7df74e803b
 */

module.exports = function Colormap(value, options) {
  options.colormap = options.colormap || colormaps.default;
  // if this is a full colormap object with author, description, and a colormap function:
  if(options.colormap.hasOwnProperty("fn") && typeof options.colormap.fn === "function"))
    colormapFunction = options.colormap.fn;
  // if this is a full colormap object but hasn't had its function generated:
  else if(options.colormap.hasOwnProperty("fn") && typeof options.colormap.fn !== "function"))
    colormapFunction = colormapFunctionGenerator(options.colormap.colormap);
  // if a lookup table is provided as an array:
  else if(typeof(options.colormap) == "object")
    colormapFunction = colormapFunctionGenerator(options.colormap);
  // if a stored colormap is named with a string like "fastie":
  else if(colormaps.hasOwnProperty(options.colormap))
    colormapFunction = colormaps[options.colormap];
  else colormapFunction = colormaps.default.fn;
  return colormapFunction(value / 255.00);
}

function colormapFunctionGenerator(segments) {
  return function(x) {
    var i, result, x0, x1, xstart, y0, y1, _i, _j, _len, _ref, _ref1, _ref2, _ref3;
    _ref = [0, 0], y0 = _ref[0], y1 = _ref[1];
    _ref1 = [segments[0][0], 1], x0 = _ref1[0], x1 = _ref1[1];
    if (x < x0) {
      return y0;
    }
    for (i = _i = 0, _len = segments.length; _i < _len; i = ++_i) {
      _ref2 = segments[i], xstart = _ref2[0], y0 = _ref2[1], y1 = _ref2[2];
      x0 = xstart;
      if (i === segments.length - 1) {
        x1 = 1;
        break;
      }
      x1 = segments[i + 1][0];
      if ((xstart <= x && x < x1)) {
        break;
      }
    }
    result = [];
    for (i = _j = 0, _ref3 = y0.length; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; i = 0 <= _ref3 ? ++_j : --_j) {
      result[i] = (x - x0) / (x1 - x0) * (y1[i] - y0[i]) + y0[i];
    }
    return result;
  };
};

var colormaps = require('.colormaps.json');

Object.keys(colormaps).forEach(function(key) {
  // make a function from the colormap, which we can't easily do in JSON
  colormaps[key].fn = colormapFunctionGenerator(colormaps[key].colormap);
});
