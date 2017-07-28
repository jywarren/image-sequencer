require('./src/ImageSequencer');
sequencer = ImageSequencer();
sequencer.loadImages('examples/red.jpg');
sequencer.addSteps('do-nothing');
