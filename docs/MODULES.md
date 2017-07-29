Documentation of various Modules
===

## Crop Module (crop)

This module is used to crop an image.

#### Usage

```js
  sequencer.loadImage('PATH')
           .addSteps('crop',options)
           .run();
```
Where `options` is an object having the properties `x`, `y`, `w`, `h`. This diagram defines these properties:

![Image](CropManual.png)

#### Defaults

* `options.x` : 0
* `options.y` : 0
* `options.w` : half of image width
* `options.h` : half of image height


## Segmented Colormap Module (segmented-colormap)

This module is used to map the pixels of the image to a segmented colormap.

#### Usage

```js
  sequencer.loadImage('PATH')
           .addSteps('segmented-colormap',options)
           .run()
```

where `options` is an object with the property `colormap`. `options.colormap` can be:

* "default" : [[0, [0, 0, 255], [38, 195, 195]], [0.5, [0, 150, 0], [255, 255, 0]], [0.75, [255, 255, 0], [255, 50, 50]]]

* "greyscale" : [[0, [0, 0, 0], [255, 255, 255]], [1, [255, 255, 255], [255, 255, 255]]]

* "stretched" : [[0, [0, 0, 255], [0, 0, 255]], [0.1, [0, 0, 255], [38, 195, 195]], [0.5, [0, 150, 0], [255, 255, 0]], [0.7, [255, 255, 0], [255, 50, 50]], [0.9, [255, 50, 50], [255, 50, 50]]]

* "fastie" : [[0, [255, 255, 255], [0, 0, 0]], [0.167, [0, 0, 0], [255, 255, 255]], [0.33, [255, 255, 255], [0, 0, 0]], [0.5, [0, 0, 0], [140, 140, 255]], [0.55, [140, 140, 255], [0, 255, 0]], [0.63, [0, 255, 0], [255, 255, 0]], [0.75, [255, 255, 0], [255, 0, 0]], [0.95, [255, 0, 0], [255, 0, 255]]]

* A custom array.

## FisheyeGl (fisheye-gl)

This module is used for correcting Fisheye or Lens Distortion

#### Usage

```js
  sequencer.loadImage('PATH')
           .addSteps('fisheye-gl',options)
           .run()
```

where `options` is an object with the following properties:
* a : a correction (0 to 4; default 1)
* b : b correction (0 to 4; default 1)
* Fx : x correction (0 to 4; default 1)
* Fy : y correction (0 to 4; default 1)
* scale : The ratio to which the original image is to be scaled (0 to 20; default 1.5)
* x : Field of View x (0 to 2; default 1)
* y : Field of View y (0 to 2; default 1)
