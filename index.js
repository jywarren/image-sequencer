console.log('\x1b[31m%s\x1b[0m',"This is the output of the module");
require('./src/ImageSequencer');
sequencer = ImageSequencer();
sequencer.loadImages({images:{red:'examples/red.jpg'},callback:function(){
  sequencer.addSteps(['ndvi-red','do-nothing','do-nothing']);
  sequencer.removeSteps(1);
  sequencer.insertSteps({
    red: [{index: -1, name: 'do-nothing-pix', o:{}}]
  });
  sequencer.run();
}});
