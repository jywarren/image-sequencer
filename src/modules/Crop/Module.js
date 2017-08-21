/*
 * Image Cropping module
 * Usage:
 *    Expected Inputs:
 *      options.x : x-coordinate of image where the modules starts cropping | default : 0
 *      options.y : y-coordinate of image where the modules starts cropping | default : 0
 *      options.w : width of the resulting cropped image | default : 50% of input image width
 *      options.h : height of the resulting cropped image | default : 50% of input image height
 *    Output:
 *      The cropped image, which is essentially a rectangle bounded by the lines:
 *          x = options.x
 *          x = options.x + options.w
 *          y = options.y
 *          y = options.y + options.h
 */
 module.exports = function CropModule(options,UI) {

   options = options || {};
   options.title = "Crop Image";

   // Tell the UI that a step has been added
   UI.onSetup(options.step);
   var output;

   // This function is caled everytime the step has to be redrawn
   function draw(input,callback) {

     // Tell the UI that the step has been triggered
     UI.onDraw(options.step);
     const step = this;

     require('./Crop')(input,options,function(out,format){

       // This output is accessible to Image Sequencer
       step.output = {
         src: out,
         format: format
       }

       // This output is accessible to the UI
       options.step.output = out;

       // Tell the UI that the step has been drawn
       UI.onComplete(options.step);

       // Tell Image Sequencer that step has been drawn
       callback();

     });

   }

   return {
     options: options,
     draw: draw,
     output: output,
     UI: UI
   }
 }
