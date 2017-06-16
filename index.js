console.log('\x1b[31m%s\x1b[0m',"This is the output of the module");
require('./src/ImageSequencer');
sequencer = ImageSequencer();
sequencer.loadImages({red:'examples/red.jpg'},function(){
  sequencer.addSteps(['do-nothing','do-nothing','do-nothing']);
  sequencer.run();
  sequencer.removeSteps(1);
  sequencer.insertSteps({
    red: [{index: -1, name: 'do-nothing', o:{}}]
  });
});
