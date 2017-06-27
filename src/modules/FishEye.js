/*
 * Display only the green channel
 */
module.exports = function FishEye(options) {

  options = options || {};
  options.title = "Fish Eye";
  options.description = "Corrects fish eye or barrel distortion.";
  var output;

  //function setup() {} // optional

  function draw(input,callback) {

  }

  return {
    options: options,
    //setup: setup, // optional
    draw:  draw,
    output: output
  }
}
