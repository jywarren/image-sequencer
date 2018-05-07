/*
* Average all pixel colors
*/
module.exports = function Average(options, UI){
    options = options || {};
    options.blur = options.blur || 2
    
    //Tell the UI that a step has been set up
    UI.onSetup(options.step);
    var output;

    options.step.metadata = options.step.metadata || {};
    
    function draw(input,callback,progressObj){

        progressObj.stop(true);
        progressObj.overrideFlag = true;
        
        // Tell the UI that a step is being drawn
        UI.onDraw(options.step);
        
        var step = this;
        
        function changePixel(r, g, b, a){
            return [r,g,b,a]
        }
        
        function extraManipulation(pixels){
            var sum = [0,0,0,0];
            pixels.forEach(function(pixel) {
              sum[0] += pixel[0];
              sum[1] += pixel[1];
              sum[2] += pixel[2];
              sum[3] += pixel[3];
            });
            sum[0] = parseInt(sum[0] / pixels.length);
            sum[1] = parseInt(sum[1] / pixels.length);
            sum[2] = parseInt(sum[2] / pixels.length);
            sum[3] = parseInt(sum[3] / pixels.length);
            // report back and store average in metadata:
            options.step.metadata.average = sum;
            console.log("average: ", sum);
            return sum;
        }

        function output(image, datauri, mimetype){
            
            // This output is accessible by Image Sequencer
            step.output = {
              src: datauri,
              format: mimetype
            };
            
            // This output is accessible by UI
            options.step.output = datauri;
            
            // Tell UI that step has been drawn.
            UI.onComplete(options.step);
        }
        
        return require('../_nomodule/PixelManipulation.js')(input, {
            output: output,
            changePixel: changePixel,
            extraManipulation: extraManipulation,
            format: input.format,
            image: options.image,
            callback: callback
        });
        
    }
    return {
        options: options,
        draw:  draw,
        output: output,
        UI: UI
    }
}
