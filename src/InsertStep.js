function InsertStep(ref, image, index, name, o) {

  function insertStep(image, index, name, o_) {
    ref.log('\x1b[36m%s\x1b[0m','inserting step \"' + name + '\" to \"' + image + '\" at \"'+index+'\".');

    var o = ref.copy(o_);
    o.id = ref.options.sequencerCounter++; //Gives a Unique ID to each step
    o.name = o.name || name;
    o.selector = o.selector || 'ismod-' + name;
    o.container = o.container || ref.options.selector;
    o.image = image;

    if(index==-1) index = ref.images[image].steps.length;

    var module = ref.modules[name](o);
    ref.images[image].steps.splice(index, 0, module);

    function defaultSetupModule() {
      if (ref.options.ui && ref.options.ui!="none") module.options.ui = ref.options.ui({
        selector: o.selector,
        title: module.options.title,
        id: o.id
      });
    }
    if (module.hasOwnProperty('setup')) module.setup(); // add a default UI, unless the module has one specified
    else defaultSetupModule.apply(module); // run default setup() in scope of module (is this right?)

    // tell the UI that a step has been inserted.

    return true;
  }

  insertStep(image, index, name, o);
}
module.exports = InsertStep;
