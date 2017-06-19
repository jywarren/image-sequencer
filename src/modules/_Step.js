module.exports = function(ref,image,pos) {
  images = ref.images;
  thisimage = images[image];
  var thisstep = thisimage[pos];
  console.log(thisstep);
  return function(img) {
    thisstep.output = img;
  }
}
