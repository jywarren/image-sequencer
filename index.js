console.log('\x1b[31m%s\x1b[0m',"This is the output of the module");
require('./src/ImageSequencerNode');
sequencer = ImageSequencer();
sequencer.loadImage('sundar','examples/SundarPichai.jpeg',function(){
  sequencer.loadImage('timetable','examples/test.png',function(){
    sequencer.addSteps('do-nothing-pix');
  });
});
