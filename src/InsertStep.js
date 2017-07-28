function InsertStep(ref, image, index, name, o) {

  function insertStep(image, index, name, o_) {
    var o = ref.copy(o_);
    o.number = ref.options.sequencerCounter++; //Gives a Unique ID to each step
    o.name = o_.name || name;
    o.selector = o_.selector || 'ismod-' + name;
    o.container = o_.container || ref.options.selector;
    o.image = image;

    if(index==-1) index = ref.images[image].steps.length;

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
    ref.images[image].steps.splice(index,0,module);

    return true;
  }

  insertStep(image, index, name, o);
}
module.exports = InsertStep;
