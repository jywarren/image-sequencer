Image Sequencer
====

aka "Consequencer"

[![Build Status](https://travis-ci.org/jywarren/image-sequencer.svg?branch=master)](https://travis-ci.org/jywarren/image-sequencer)

## Why

Image Sequencer is different from other image processing systems in that it's non-destructive: instead of modifying the original image, it creates a new image at each step in a sequence. This is because it:

* produces a legible trail of operations, to "show your work" for evidential, educational, or reproducibility reasons
* makes the creation of new tools or "modules" simpler -- each must accept an input image, and produce an output image
* allows many images to be run through the same sequence of steps

It is also for prototyping some other related ideas:

* filter-like image processing -- applying a transform to any image from a given source, like a proxy. I.e. every image tile of a satellite imagery web map
* test-based image processing -- the ability to create a sequence of steps that do the same task as some other image processing tool, provable with example before/after images to compare with
* logging of each step to produce an evidentiary record of modifications to an original image
* cascading changes -- change an earlier step's settings, and see those changes affect later steps
* "small modules"-based extensibility: see [Contributing](#contributing), below

## Examples:

* [Basic example](https://jywarren.github.io/image-sequencer/)
* [NDVI example](https://jywarren.github.io/image-sequencer/examples/ndvi/) - related to [Infragram.org](http://infragram.org)

## Using the library:


### Initializing the Sequencer

The Image Sequencer Library exports a function ImageSequencer which initializes a sequencer.

```js
var sequencer = ImageSequencer();
```

### Loading Images into the Sequencer

Image Sequencer has an array of images which gets stored in `sequencer.images` in this case.
Images can be loaded into this array by the method `loadImages`.
loadImages accepts 1, 2, or 3 parameters.

* 3/2 parameters :
    ```js
    sequencer.loadImages(image_name,
      image_src,optional_callback);
    ```
* 1/2 parameters (JSON) :
    ```js
    sequencer.loadImages({
      image_name_1: image_src,
      image_name_2: image_src,
      ...
    }, optional_callback);
    ```

### Adding Steps on Images

After loading the image, we can add modules to the image using the addSteps method.
The options argument (object) is an optional parameter to pass in arguments to the module.
In all the following examples, `image_name` and `module_name` may be a string or an array of strings.

```js
sequencer.addSteps(image_name,module_name,optional_options);
```

If no Image Name is specified, the module is added to **all** images.

```js
sequencer.addSteps(module_name,optional_options);
```

All this can be passed in as JSON:

```js
sequencer.addSteps({
  image_name: {name: module_name, o: optional_options},
  image_name: {name: module_name, o: optional_options},
  ...
});
```

### Running the Sequencer

After adding the steps, now we must generate output for each of the step via the `run` method.
The `run` method accepts parameters `image` and `from`.
`from` is the index from where the function starts generating output. By default, it will run across all the steps. (from = 1) If no image is specified, the sequencer will be run over all the images.

```js
sequencer.run(); //All images from first step
```

```js
sequencer.run(image,from); //Image 'image' from 'from'
```

image may either be an array or a string.
An optional callback may also be passed.

### Removing Steps from an Image

Steps can be removed using the `removeSteps` method. It accepts `image` and `index` as parameters.
Either, both, or none of them can be an array. JSON input is also accepted.

```js
sequencer.removeSteps("image",[steps]);
```

```js
sequencer.removeSteps("image",step);
```

```js
sequencer.removeSteps({
  image: [steps],
  image: [steps],
  ...
});
```

### Inserting steps on an image

Steps can be inserted using the `insertSteps` method. It accepts `image`, `index`, `module_name` and `optional_options` as parameters. `image` may be an array. `optional_options` is an object. The rest are literals. JSON Input is supported too. If no image is provided, Steps will be inserted on all images. Indexes can be negative. Negative sign with an index means that counting will be done in reverse order. If the index is out of bounds, the counting will wrap in the original direction of counting.
```js
sequencer.insertSteps("image",index,"module_name",o);
```
```js
sequencer.insertSteps([image],index,"module_name",o);
```
```js
sequencer.insertSteps({
  image1: [
    {index:index1, name: module_name1, o:optional_options1},
    {index:index2, name: module_name2, o:optional_options2},
    ...
  ]
});
```


## Contributing

Happily accepting pull requests; to edit the core library, modify files in `/src/`. To build, run `npm install` and `grunt build`.

### Contributing modules

Most contribution (we imagine) would be in the form of API-compatible modules, which need not be directly included.

#### draw()

To add a module to Image Sequencer, it must have the following method; you can wrap an existing module to add them:

* `module.draw()`

The `draw(input,callback)` method should accept an `input` parameter, which will be an object of the form:

```js
input = {
  src: "datauri here",
  format: "jpeg/png/etc"
}
```

The  `image` object is essentially the output of the previous step.

The draw method must, when it is complete, pass the output image to the method `this.output = modified_input`, which will send the output to the next module in the chain. For example:

```js
function draw(image) {

  // do some stuff with the image

  this.output = image;
  callback();
}
```

#### Title

For display in the web-based UI, each module may also have a title like `options.title`.

#### Module example

See existing module `green-channel` for an example: https://github.com/jywarren/image-sequencer/tree/master/src/modules/GreenChannel.js

For help integrating, please open an issue.

****

## Development

Notes on development next steps:

### UI

* [ ] add createUserInterface() which is set up by default to draw on ImageBoardUI, but could be swapped for nothing, or an equiv. lib
* [ ] it could create the interface and use event listeners like module.on('draw', fn()); to update the interface

* [ ] spinners before panels are complete
* [ ] is there a module for generating forms from parameters?
* [ ] click to expand for all images
* [ ] `ImageSequencer.Renderer` class to manage image output formats and adapters
* [ ] remove step

* [ ] output besides an image -- like `message(txt)` to display to the step's UI


### Modularization

* [ ] remotely includable modules, not compiled in -- see plugin structures in other libs
* [ ] ability to start running at any point -- already works?
* [ ] commandline runnability?
  * [ ] Make available as browserified OR `require()` includable...
* [ ] standardize panel addition with submodule that offers Panel.display(image)
* [ ] allow passing data as data-uri or Image object, or stream, or ndarray or ImageData array, if both of neighboring pair has ability?
  * see https://github.com/jywarren/image-sequencer/issues/1
* [ ] ...could we directly include package.json for module descriptions? At least as a fallback.
* [ ] (for node-and-line style UIs) non-linear sequences with Y-splitters
* [ ] `sequencer.addModule('path/to/module.js')` style module addition -- also to avoid browserifying all of Plotly :-P
* [ ] remove step

### Testing

* [ ] tests - modules headless; unit tests
* [ ] comparisons with diff
  * [ ] testing a module's promised functionality: each module could offer before/after images as part of their API; by running the module on the before image, you should get exactly the after image, comparing with an image diff

### Use cases

* [ ] make an Infragram module that accepts a math expression

### Bugs

* [ ] BUG: this doesn't work for defaults:  imageboard.loadImage('examples/grid.png', function() {
  * we should make defaults a config of the first module

****

## Module Candidates

* https://github.com/linuxenko/rextract.js
* https://www.npmjs.com/package/histogram
* https://github.com/hughsk/flood-fill
* https://www.npmjs.com/package/blink-diff
* smaller and faster: https://www.npmjs.com/package/@schornio/pixelmatch
* https://github.com/yahoo/pngjs-image has lots of useful general-purpose image getters like `image.getLuminosityAtIndex(idx)`
* some way to add in a new image (respecting alpha) -- `add-image` (with blend mode, default `normal`?)
* https://github.com/yuta1984/CannyJS - edge detection
* http://codepen.io/taylorcoffelt/pen/EsCcr - more edge detection

## Ideas

* https://github.com/vicapow/jsqrcode
* https://github.com/jadnco/whirl - scrubbable image sequence player
* non graphics card GL functions could be shimmed with https://github.com/Overv/JSGL
* or this: https://github.com/stackgl/headless-gl
* https://github.com/mattdesl/fontpath-simple-renderer
* output in animated Gif? as a module

### Referencing earlier states

Complex sequences with masking could require accessing previous states (or nonlinearity):

* flood-fill an area
* select only the flooded area
  * roundabout: lighten everything to <50%, then flood-fill with black? Not 100% reliable.
  * roundabout 2: `flood fill`, then `blink-diff` with original
* then add step which recovers original image, repeat `flood-fill`/`blink-diff` for second region
* reference above masked states in a `mask` module, with `maskModule.draw(image, { getMask: function() { return maskImg } })`

****

**Notes:**

`pattern-fill` module to use patterns in JS canvas:

```js
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
var img=document.getElementById("lamp");
var pat=ctx.createPattern(img,"repeat");
ctx.rect(0,0,150,100);
ctx.fillStyle=pat;
ctx.fill();
```

Masking:

```js
ctx.save();
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(160, 600);
ctx.rect(0, 0, 160, 600);
ctx.closePath();
ctx.clip();
ctx.drawImage(img, 0, 0);
ctx.restore();
```

****

## UI notes:

* visual nodes-and-lines UI: https://github.com/flowhub/the-graph
  * https://flowhub.github.io/the-graph/examples/demo-simple.html



```js

settings: {
  'threshold': {
    type: 'slider',
    label: 'Threshold',
    default: 50,
    min: 0,
    max: 100
  },
  'colors': {
    type: 'select',
    label: 'Colors',
    options: [
      { name: '0', value: '0', default: true },
      { name: '1', value: '1' },
      { name: '2', value: '2' }
    ]
  }
}

```

Possible web-based commandline interface: https://hyper.is/?


### Path cutting

* threshold
* vectorize
  * edge detect
  * direction find (vectorize and colorize)
