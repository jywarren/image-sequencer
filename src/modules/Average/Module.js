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

        // do the averaging        
        function extraManipulation(pixels){
            var sum = [0,0,0,0];
            for (var i = 0; i < pixels.data.length; i += 4) {
              sum[0] += pixels.data[i + 0];
              sum[1] += pixels.data[i + 1];
              sum[2] += pixels.data[i + 2];
              sum[3] += pixels.data[i + 3];
            }

            sum[0] = parseInt(sum[0] / (pixels.data.length / 4));
            sum[1] = parseInt(sum[1] / (pixels.data.length / 4));
            sum[2] = parseInt(sum[2] / (pixels.data.length / 4));
            sum[3] = parseInt(sum[3] / (pixels.data.length / 4));

            for (var i = 0; i < pixels.data.length; i += 4) {
              pixels.data[i + 0] = sum[0];
              pixels.data[i + 1] = sum[1];
              pixels.data[i + 2] = sum[2];
              pixels.data[i + 3] = sum[3];
            }
            // report back and store average in metadata:
            options.step.metadata.averages = sum;
            console.log("average: ", sum);
            return pixels;
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
