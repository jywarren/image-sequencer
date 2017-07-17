function AddStep(ref, image, name, o) {

  function addStep(image, name, o_) {
    ref.log('\x1b[36m%s\x1b[0m','adding step \"' + name + '\" to \"' + image + '\".');

    var o = ref.copy(o_);
    o.id = ref.options.sequencerCounter++; //Gives a Unique ID to each step
    o.name = o_.name || name;
    o.selector = o_.selector || 'ismod-' + name;
    o.container = o_.container || ref.options.selector;
    o.image = image;

    var module = ref.modules[name].call(ref.images,o);
    ref.images[image].steps.push(module);


    function defaultSetupModule() {
      if (ref.options.ui && ref.options.ui!="none") module.options.ui = ref.options.ui({
        selector: o.selector,
        title: module.options.title,
        id: o.id
      });
    }
    if (module.hasOwnProperty('setup')) module.setup(); // add a default UI, unless the module has one specified
    else defaultSetupModule.apply(module); // run default setup() in scope of module (is this right?)

    // tell the UI that a step has been added.
    return true;
  }

  addStep(image, name, o);
}
module.exports = AddStep;
