module.exports = function(ref,options) {
  images = ref.images;
  thisimage = images[options.image];
  for (i in thisimage.steps){
    if (thisimage.steps[i].options.id == options.id) pos = i;
  }
  olddata = thisimage.steps[pos-1].output;
  if (typeof(olddata) == 'undefined') return false;
  var newdata = JSON.parse(JSON.stringify(olddata));
  return [newdata,pos];
}
