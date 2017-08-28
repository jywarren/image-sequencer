#!/usr/bin/env node

require('./src/ImageSequencer');
sequencer = ImageSequencer({ui: false});

var program = require('commander');
var readlineSync = require('readline-sync');

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

// Parse step into an array to allow for multiple step.
program.step = program.step.split(" ");

// User must input an image.
if(!program.image) exit("Can't read file.")

// User must input an image.
require('fs').access(program.image, function(err){
  if(err) exit("Can't read file.")
});

// User must input a step. If step exists, check that every step is a valid step.
if(!program.step || !program.step.every(function(step){return sequencer.modulesInfo().hasOwnProperty(step)}))
  exit("Please name a valid step.");

// If there's no user defined output directory, select a default directory.
program.output = program.output || "./output/";

// Set sequencer to log module outputs, if any.
sequencer.setUI({

  onComplete: function(step) {

    // Get information of outputs.
    step.info = sequencer.modulesInfo(step.name);

    for (var output in step.info.outputs) {
      console.log("["+program.step+"]: "+output+" = "+step[output]);
    }

  }

});

// Finally, if everything is alright, load the image, add the steps and run the sequencer.
sequencer.loadImages(program.image,function(){

  // Iterate through the steps and retrieve their inputs.
  program.step.forEach(function(step){
    var options = Object.assign({}, sequencer.modulesInfo(step).inputs);

    // If inputs exists, iterate through them and prompt for values.
    Object.keys(options).forEach(function(input) {
        console.log(step + " : " + input + " : " + options[input].desc);
        var value = readlineSync.question(step + " : " + "Enter a value for " + input + " : ");
        options[input] = value;
    });

    // Add the step and its options to the sequencer.
    sequencer.addSteps(step, options);
  });

  // Run the sequencer.
  sequencer.run(function(){

    // Export all images as binary files.
    sequencer.exportBin(program.output);

    console.log("Files will be exported to \""+program.output+"\"");

  });

});