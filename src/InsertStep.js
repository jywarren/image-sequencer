const getStepUtils = require('./util/getStep.js');

// insert one or more steps at a given index in the sequencer
function InsertStep(ref, image, index, name, o) {
  if (ref.sequences[name]) {
    return ref.importJSON(ref.sequences[name]);
  }

  function insertStep(image, index, name, o_) {
    if (ref.modules[name]) var moduleInfo = ref.modules[name][1];
    else {
      console.log('Module ' + name + ' not found.');
    }

    var o = ref.copy(o_);
    o.number = ref.options.sequencerCounter++; //Gives a Unique ID to each step
    o.name = o_.name || name || moduleInfo.name;
    o.description = o_.description || moduleInfo.description;
    o.selector = o_.selector || 'ismod-' + name;
    o.container = o_.container || ref.options.selector;
    o.image = image;
    o.inBrowser = ref.options.inBrowser;

    if (index == -1) index = ref.images[image].steps.length;

    o.step = {
      name: o.name,
      description: o.description,
      ID: o.number,
      imageName: o.image,
      inBrowser: ref.options.inBrowser,
      ui: ref.options.ui,
      options: o
    };
    var UI = ref.events;

    // Tell UI that a step has been set up.
    o = o || {};
    ref.modules[name].expandSteps = function expandSteps(stepsArray) {
      for (var step of stepsArray) {
        ref.addSteps(step['name'], step['options']);
      }
    }
    var mod = ref.modules[name][0](o, UI);
    if (!mod.isMeta) {
      UI.onSetup(o.step);
      ref.images[image].steps.splice(index, 0, mod);
    }

    return true;
  }

  insertStep(image, index, name, o);
  ref.steps = ref.images[image].steps;

}
module.exports = InsertStep;
