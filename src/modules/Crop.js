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
 module.exports = function Crop(options){

   options = options || {};
   options.title = "Crop Image";
   options.format = options.format || "png";

   function draw(image) {
     var getPixels = require("get-pixels"),
         savePixels = require("save-pixels"),
         base64 = require('base64-stream');

     getPixels(image.src,function(err,pixels){
       var newdata = [];
       var ox = options.x || 0;
       var oy = options.y || 0;
       var w = options.w || Math.floor(0.5*pixels.shape[0]);
       var h = options.h || Math.floor(0.5*pixels.shape[1]);
       var iw = pixels.shape[0]; //Width of Original Image
       newarray = new Uint8Array(4*w*h);
       for (var n = oy; n < oy + h; n++) {
         newarray.set(pixels.data.slice(n*4*iw + ox, n*4*iw + ox + 4*w),4*w*(n-oy));
       }
       pixels.data = newarray;
       pixels.shape = [w,h,4];
       pixels.stride[1] = 4*w;

       var buffer = base64.encode();
       savePixels(pixels, options.format)
         .on('end', function() {

         var img = new Image();

         img.src = 'data:image/' + options.format + ';base64,' + buffer.read().toString();

         if (options.output) options.output(img);

       }).pipe(buffer);

     });
   }

   return {
     options: options,
     draw: draw
   }
 }
