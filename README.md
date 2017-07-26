Image Sequencer
====

aka "Consequencer"

[![Build Status](https://travis-ci.org/publiclab/image-sequencer.svg?branch=master)](https://travis-ci.org/publiclab/image-sequencer)

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

## Quick Usage

Image Sequencer can be used to run modules on an HTML Image Element using the
`replaceImage` method. The method accepts two parameters - `selector` and `steps`.
`selector` is a CSS selector. If it matches multiple images, all images will be
modified. `steps` may be the name of a module or array of names of modules.

Note: Browser CORS Restrictions apply. Some browsers may not allow local images
form other folders, and throw a Security Error instead.

```js
  sequencer.replaceImage(selector,steps,optional_options);
```

`optional_options` allows to pass additional arguments to the module itself.

For example:

```js
  sequencer.replaceImage('#photo','invert');
  sequencer.replaceImage('#photo',['invert','ndvi-red']);
```


## Classic Usage

### Initializing the Sequencer

The Image Sequencer Library exports a function ImageSequencer which initializes a sequencer.

```js
var sequencer = ImageSequencer();
```

### Loading an Image into the Sequencer

The `loadImage` method is used to load an image into the sequencer. It accepts
a name and an image. The method also accepts an optional callback.

```js
sequencer.loadImage(image_src,optional_callback);
```
On `Node.js` the `image_src` may be a DataURI or a local path. On browsers, it
must be a DatURI (or 'selector to image' -- Work in Progress)

return value: **`sequencer`** (To allow method chaining)


### Adding steps to the image

The `addSteps` method is used to add steps on the image. One or more steps can
be added at a time. Each step is called a module.

```js
sequencer.addSteps(modules, optional_options);
```

If only one module is to be added, `modules` is simply the name of the module.
If multiple images are to be added, `modules` is an array of the names of modules
which are to be added, in that particular order.

optional_otions is just additional parameters, in object form, which you might
want to provide to the modules. It's an optional parameter.

return value: **`sequencer`** (To allow method chaining)


### Running the Sequencer

Once all steps are added, This method is used to generate the output of all these
modules.

```js
sequencer.run();
```

Additionally, an optional callback can be passed to this method.

```js
sequencer.run(function(out){
  // this gets called back.
  // "out" is the DataURL of the final image.
});
```

return value: **`sequencer`** (To allow method chaining)


### Removing a step from the sequencer

The `removeSteps` method is used to remove unwanted steps from the sequencer.
It accepts the index of the step as an input, or an array of the unwanted indices
if there are more than one.

For example, if the modules ['ndvi-red','crop','invert'] were added in this order,
and I wanted to remove 'crop' and 'invert', I can either do this:
```js
sequencer.removeSteps(2);
sequencer.removeSteps(3);
```
or:
```js
sequencer.removeSteps([2,3]);
```

return value: **`sequencer`** (To allow method chaining)


### Inserting a step in between the sequencer

The `insertSteps` method can be used to insert one or more steps at a given index
in the sequencer. It accepts the index where the module is to be inserted, name of
the module, and an optional options parameter. `index` is the index of the inserted
step. Only one step can be inserted at a time. `optional_options` plays the same
role it played in `addSteps`.

Indexes can be negative. Negative sign with an index means that counting will be
done in reverse order. If the index is out of bounds, the counting will wrap in
the original direction of counting. So, an `index` of -1 means that the module is
inserted at the end.

```js
sequencer.insertSteps(index,module_name,optional_options);
```

return value: **`sequencer`** (To allow method chaining)


## Method Chaining
Methods can be chained on the Image Sequencer:
* run() can not be in the middle of the chain.
* If the chain starts with loadImage() or loadImages(), the following methods are
applied only to the newly loaded images.
* If no name is provided to the image, a name will be generated for it. The name will
be of the form "image<number>". For ex: "image1", "image2", "image3", etc.

Valid Chains:
```js
sequencer.loadImage('red').addSteps('invert').run(function(out){
  //do something with otuput.
});
sequencer.addSteps(['ndvi-red','invert']).run();
et cetra.
```

Invalid Chains:
```js
sequencer.addSteps('invert').run().addSteps('ndvi-red');
```


## Multiple Images
Image Sequencer is capable of handling multiple images at once.

### Initializing a sequencer with multiple images.
This is just like before.
```js
var sequencer = ImageSequencer();
```

### Loading Multiple Images into the Sequencer

Multiple images can be loaded by the method `loadImages`. Everything is the same,
except that now, a unique identification called `image_name` has to be provided
with each image. This is a string literal.

* 3/2 parameters :
    ```js
    sequencer.loadImages(image_name,
      image_src,optional_callback);
    ```
* 1/2 parameters (JSON) :
    ```js
    sequencer.loadImages({
      images: {
        image1_name: image_src,
        image2_name: image_src,
        ...
      },
      callback: optional_callback
    });
    ```

return value: **`sequencer`** (To allow method chaining)


### Adding Steps on Multiple Images

The same method `addSteps` is used for this. There's just a slight obvious change
in the syntax that the image name has to be supplied too. `image_name` as well as
`module_name` in the following examples can be either strings or arrays of strings.

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
  image1_name: {name: module_name, o: optional_options},
  image2_name: {name: module_name, o: optional_options},
  ...
});
```

return value: **`sequencer`** (To allow method chaining)


### Running a Sequencer with multiple images

The same `run` method can be used with a slight change in syntax.
The `run` method accepts parameters `image` and `from`. `from` is the index from
where the function starts generating output. By default, it will run across all
the steps. (from = 1) If no image is specified, the sequencer will be run over **all
the images**. `image_name` may be an array of image names.

```js
sequencer.run(); //All images from first step
```

```js
sequencer.run(image_name,from); //Image 'image' from 'from'
```

The `run` method also accepts an optional callback just like before:

```js
  sequencer.run(image_name,from,function(out){
    // This gets called back.
    // "out" is the DataURL of final image.
  });
```

JSON Input is also acceptable.

```js
sequencer.run({
  image1_name: from,
  image2_name: from,
  ...
});
```

return value: **`sequencer`** (To allow method chaining)


### Removing Steps from an Image

Similarly, `removeSteps` can also accept an `image_name` parameter. Either, both,
or none of `image_name` and `steps` them may be an array. JSON input is also acceptable.

```js
sequencer.removeSteps("image_name",[steps]);
```

```js
sequencer.removeSteps("image_name",step);
```

```js
sequencer.removeSteps({
  image1_name: [steps],
  image2_name: [steps],
  ...
});
```
return value: **`sequencer`** (To allow method chaining)


### Inserting steps on an image

The `insertSteps` method can also accept an `image_name` parameter. `image_name`
may be an array. Everything else remains the same. JSON Inout is acceptable too.

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
return value: **`sequencer`** (To allow method chaining)


## Creating a User Interface

Image Sequencer provides the following events which can be used to generate a UI:

* `onSetup` : this event is triggered when a new module is set up. This can be used,
for instance, to generate a DIV element to store the generated image for that step.
* `onDraw` : This event is triggered when Image Sequencer starts drawing the output
for a module. This can be used, for instance, to overlay a loading GIF over the DIV
generated above.
* `onComplete` : This event is triggered when Image Sequencer has drawn the output
for a module. This can be used, for instance, to update the DIV with the new image
and remove the loading GIF generated above.
* `onRemove` : This event is triggered when a module is removed. This can be used,
for instance, to remove the DIV generated above.

How to define these functions:

```js
sequencer.setUI({
  onSetup: function() {},
  onDraw: function() {},
  onComplete: function(output) {},
  onRemove: function() {}
});
```

These methods can be defined and re-defined at any time, but it is advisable to
set them before any module is added and not change it thereafter. This is because
the `setUI` method will only affect the modules added after `setUI` is called.

The `onComplete` event is passed on the output of the module.

In the scope of all these events, the following variables are present, which
may be used in generating the UI:
* The object `identity`
```
identity = {
  stepName: "Name of the Step",
  stepID: "A unique ID given to the step",
  imageName: "The name of the image to which the step is added."
}
```
* The variable `options.inBrowser` which is a Boolean and is `true` if the client is a browser and `false` otherwise.

Note: `identity.imageName` is the "name" of that particular image. This name can be specified
while loading the image via `sequencer.loadImage("name","SRC")`. If not specified,
the name of a loaded image defaults to a name like "image1", "image2", et cetra.

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
* [x] ability to start running at any point -- already works?
* [x] commandline runnability?
  * [x] Make available as browserified OR `require()` includable...
* [ ] standardize panel addition with submodule that offers Panel.display(image)
* [ ] allow passing data as data-uri or Image object, or stream, or ndarray or ImageData array, if both of neighboring pair has ability?
  * see https://github.com/jywarren/image-sequencer/issues/1
* [ ] ...could we directly include package.json for module descriptions? At least as a fallback.
* [ ] (for node-and-line style UIs) non-linear sequences with Y-splitters
* [ ] `sequencer.addModule('path/to/module.js')` style module addition -- also to avoid browserifying all of Plotly :-P
* [x] remove step

### Testing

* [ ] tests - modules headless; unit tests
* [ ] comparisons with diff
  * [ ] testing a module's promised functionality: each module could offer before/after images as part of their API; by running the module on the before image, you should get exactly the after image, comparing with an image diff

### Use cases

* [ ] make an Infragram module that accepts a math expression

### Bugs

* [x] BUG: this doesn't work for defaults:  imageboard.loadImage('examples/grid.png', function() {});
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
