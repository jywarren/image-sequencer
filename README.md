ImageBoard
ImageFlow

========

* [ ] steps don't run on last step; they run on initial image


// add createUserInterface() which is set up by default to draw on ImageBoardUI, but could be swapped for nothing, or an equiv. lib
// it could create the interface and use event listeners like module.on('draw', fn()); to update the interface

* [ ] spinners before panels are complete
* [ ] ability to start running at any point -- already works?
  * [ ] setNextStep()?

* [ ] figure out UI/functional separation -- ui is in module wrapper?
* [ ] is there a module for generating forms from parameters?
* [ ] commandline runnability?
* [ ] tests - modules headless; unit tests
* [ ] comparisons with diff
* [ ] standardize panel addition with submodule that offers Panel.display(image)

https://www.npmjs.com/package/histogram

* [ ] make an Infragram module that accepts a math expression
* [ ] click to expand for all images
* [ ] "add a new step" menu

* [ ] allow passing data as data-uri or Image object, or stream, or ndarray or ImageData array, if both of neighboring pair has ability?
* [ ] ...could we directly include package.json for module descriptions? At least as a fallback.

* [ ] BUG: this doesn't work for defaults:  imageboard.loadImage('examples/grid.png', function() {
  * we should make defaults a config of the first module

* [ ] output in animated Gif? 

****

## Why

How can Scratch/others do what a scientific tool does?

* if it passes the same tests, it's empirically equivalent

Competitive with program X? Build bridges

Show your work: Collins

Activities: teachability -- each step

Evidentiary: Chain of custody

Store each previous step, log, in metadata -- like shapefiles

****

Ideas:

https://github.com/vicapow/jsqrcode

