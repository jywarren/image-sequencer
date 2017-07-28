function AddStep(ref, image, name, o) {

  function addStep(image, name, o_) {
    var o = ref.copy(o_);
    o.number = ref.options.sequencerCounter++; //Gives a Unique ID to each step
    o.name = o_.name || name;
    o.selector = o_.selector || 'ismod-' + name;
    o.container = o_.container || ref.options.selector;
    o.image = image;

    o.identity = {
      stepName: o.name,
      stepID: o.number,
      imageName: o.image
    };
    o.UIFs = ref.UI();
    var UI = {
      onSetup: function(){o.UIFs.onSetup(o.identity);},
      onDraw: function(){o.UIFs.onSetup(o.identity);},
      onComplete: function(out){o.UIFs.onSetup(o.identity,out);},
      onRemove: function(){o.UIFs.onSetup(o.identity);},
    }
    var module = ref.modules[name](o,UI);
    ref.images[image].steps.push(module);

    return true;
  }

  addStep(image, name, o);
}
module.exports = AddStep;
