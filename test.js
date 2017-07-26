require('./src/ImageSequencer');
sequencer = ImageSequencer();
sequencer.loadImages({images:{red:'examples/red.jpg'},callback:function(){
  sequencer.addSteps(['do-nothing','invert']).run();
}});
