/*
 * Core modules
 */
module.exports = {
  'do-nothing': require('./modules/DoNothing/Module'),
  'green-channel': require('./modules/GreenChannel/Module'),
  'ndvi-red': require('./modules/NdviRed/Module'),
  'do-nothing-pix': require('./modules/DoNothingPix/Module.js'),
  'invert': require('./modules/Invert/Module'),
  'crop': require('./modules/Crop/Module'),
  'segmented-colormap': require('./modules/SegmentedColormap/Module')
}
