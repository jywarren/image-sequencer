require('./dist/image-sequencer-node');
sequencer = ImageSequencer();
sequencer.loadImage('examples/grid.png');
sequencer.addStep('ndvi-red');
