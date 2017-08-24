#!/usr/bin/env node

require('./src/ImageSequencer');
sequencer = ImageSequencer({ui: false});

var program = require('commander');

function exit(message) {
  console.log(message);
  process.exit(1);
}

program
  .version('0.1.0')
  .option('-i, --image [PATH/URL]', 'Input image URL')
  .option('-s, --step [step-name]', 'Name of the step to be added.')
  .option('-o, --output [PATH]', 'Directory where output will be stored.')
  .parse(process.argv);

if(!program.image) exit("Can't read file.")

require('fs').access(program.image, function(err){
  if(err) exit("Can't read file.")
});

if(!program.step || !sequencer.modulesInfo().hasOwnProperty(program.step))
  exit("Please name a valid step.");

program.output = program.output || "./output/";

sequencer.loadImages(program.image,function(){
  sequencer.addSteps(program.step);
  sequencer.run(function(){
    sequencer.exportBin(program.output);
    console.log("Files will be exported to \""+program.output+"\"");
  });
});
