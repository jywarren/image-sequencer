/* 
* Changes the Image Brightness
*/

module.exports = function Brightness(options,UI){
    options = options || {};

    //Tell the UI that a step has been set up
    UI.onSetup(options.step);
    var output;

    function draw(input,callback,progressObj){
        
        progressObj.stop(true);
        progressObj.overrideFlag = true;

        /*
        In this case progress is handled by changepixel internally otherwise progressObj
        needs to be overriden and used 
        For eg. progressObj = new SomeProgressModule()
        */

        // Tell the UI that a step is being drawn
        UI.onDraw(options.step);
        
        var step = this;
        
        function changePixel(r, g, b, a){
            var val = (options.brightness)/100.0

            r = val*r<255?val*r:255
            g = val*g<255?val*g:255
            b = val*b<255?val*b:255
            return [r , g, b, a]
        }
        
        function output(image,datauri,mimetype){
            
            // This output is accessible by Image Sequencer
            step.output = {src:datauri,format:mimetype};
            
            // This output is accessible by UI
            options.step.output = datauri;
            
            // Tell UI that step has been drawn.
            UI.onComplete(options.step);
        }
        
        return require('../_nomodule/PixelManipulation.js')(input, {
            output: output,
            changePixel: changePixel,
            format: input.format,
            image: options.image,
            inBrowser: options.inBrowser,
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
