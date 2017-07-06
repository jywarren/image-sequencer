function Run(ref, json_q, callback) {

  function drawStep(drawarray,pos) {
    if(pos==drawarray.length) {
      image = drawarray[pos-1].image;
      if(ref.objTypeOf(callback)=='Function'){
        steps = ref.images[image].steps;
        out = steps[steps.length-1].output.src;
        callback(out);
        return;
      }
    }
    image = drawarray[pos].image;
    i = drawarray[pos].i;
    input = ref.images[image].steps[i-1].output;
    ref.images[image].steps[i].draw(ref.copy(input),function(){
      drawStep(drawarray,++pos);
    });
  }
  function drawSteps(json_q) {
    drawarray = [];
    for (image in json_q) {
      no_steps = ref.images[image].steps.length;
      init = json_q[image];
      for(i = 0; i < no_steps-init; i++) {
        drawarray.push({image: image,i: init+i});
      }
    }
    drawStep(drawarray,0);
  }
  function filter(json_q){
    for (image in json_q) {
      if (json_q[image]==0 && ref.images[image].steps.length==1)
        delete json_q[image];
      else json_q[image]++;
    }
    for (image in json_q) {
      prevstep = ref.images[image].steps[json_q[image]-1];
      while (typeof(prevstep) == "undefined" || typeof(prevstep.output) == "undefined") {
        prevstep = ref.images[image].steps[(--json_q[image]) - 1];
      }
    }
    return json_q;
  }
  json_q = filter(json_q);
  drawSteps(json_q);
}
module.exports = Run;
