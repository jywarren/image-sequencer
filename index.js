#!/usr/bin/env node

require('./src/ImageSequencer');
sequencer = ImageSequencer({ui: false});

var program = require('commander');

function exit(message) {
  console.error(message);
  process.exit(1);
}

program
  .version('0.1.0')
  .option('-i, --image [PATH/URL]', 'Input image URL')
  .option('-s, --step [step-name]', 'Name of the step to be added.')
  .option('-o, --output [PATH]', 'Directory where output will be stored.')
  .option('-op, --opions {object}', 'Options for the step')
  .parse(process.argv);

// User must input an image.
if(!program.image) exit("Can't read file.")

// User must input an image.
require('fs').access(program.image, function(err){
  if(err) exit("Can't read file.")
});

// User must input a step.
if(!program.step || !sequencer.modulesInfo().hasOwnProperty(program.step))
  exit("Please name a valid step.");

// If there's no user defined output directory, select a default directory
program.output = program.output || "./output/";

// set sequencer to log module outputs, if any
sequencer.setUI({

  onComplete: function(step) {

    // get information of outputs
    step.info = sequencer.modulesInfo(step.name);

    for (var output in step.info.outputs) {
      console.log("["+program.step+"]: "+output+" = "+step[output]);
    }

  }

});

// Finally, if everything is alright, load the image, add the step and run the sequencer.
sequencer.loadImages(program.image,function(){

  // Add the step inputted by the user
  sequencer.addSteps(program.step);

  // Run the sequencer
  sequencer.run(function(){

    // Export all images as binary files
    sequencer.exportBin(program.output);

    console.log("Files will be exported to \""+program.output+"\"");

  });

});
