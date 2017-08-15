/*
 * Core modules and their info files
 */
module.exports = {
  'do-nothing': [
    require('./modules/DoNothing/Module'),require('./modules/DoNothing/info')
  ],
  'green-channel': [
    require('./modules/GreenChannel/Module'),require('./modules/GreenChannel/info')
  ],
  'ndvi-red': [
    require('./modules/NdviRed/Module'),require('./modules/NdviRed/info')
  ],
  'do-nothing-pix': [
    require('./modules/DoNothingPix/Module'),require('./modules/DoNothingPix/info')
  ],
  'invert': [
    require('./modules/Invert/Module'),require('./modules/Invert/info')
  ],
  'crop': [
    require('./modules/Crop/Module'),require('./modules/Crop/info')
  ],
  'segmented-colormap': [
    require('./modules/SegmentedColormap/Module'),require('./modules/SegmentedColormap/info')
  ],
  'decode-qr': [
    require('./modules/DecodeQr/Module'),require('./modules/DecodeQr/info')
  ],
  'fisheye-gl': [
    require('./modules/FisheyeGl/Module'),require('./modules/FisheyeGl/info')
  ]
}
