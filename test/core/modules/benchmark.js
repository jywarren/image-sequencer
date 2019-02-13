'use strict';

var fs = require('fs');
var test = require('tape');
var DataURItoBuffer = require('data-uri-to-buffer');

require('../../../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: false });
var image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH8AAAB/CAYAAADGvR0TAAAAAklEQVR4AewaftIAAAI0SURBVO3BsZHjOABE0X9dTAL+ZQF6FwI85qBomIM8xHCOEAvC2I1gqKpBqaSZ7vf++f/f//4QlkTYEmFLhC0RtkTYEmFrY1FplRWzD66UVlkx+2BFaZUVsw+ulFZZMfvgu0TYEmFLhC0RtkTYEmFLhK2NJ0qrxOcqrXJl9sFXRNgSYUuELRG2RNgSYUuErY0nZh9cKa2yorTKb1Za5ZVmH3yXCFsibImwJcKWCFsibImwtfFEaZVXut0frDiPnXe63R+sOI+dFaVVrsw++IoIWyJsibAlwpYIWyJsibC18cTsgxWlVeL7Zh+8ighbImyJsCXClghbImyJsLXxRGmVVzqPnZ/sPHZeqbTKitkHXxFhS4QtEbZE2BJhS4QtEbY2Fs0+uFJa5Z1Kq/xksw+ulFb5LhG2RNgSYUuELRG2RNgSYWvjw93uD1acx86K2/3BivPY+VQibImwJcKWCFsibImwJcKWCFsibImwJcKWCFsibImwJcLWxoc7j513Oo+d30qELRG2RNgSYUuELRG2RNjaeLHZB+9UWmXF7IPfSoQtEbZE2BJhS4QtEbZE2Nr44UqrXLndH6w4j50rsw9+KhG2RNgSYUuELRG2RNgSYWvjw5VWuXK7P3il2/3BlfPYuTL74FOJsCXClghbImyJsCXClghbG4tKq1yZffBK57Hzm5VWeRURtkTYEmFLhC0RtkTYEmFr44nZB+80+8DZ7INXEWFLhC0RtkTYEmFLhC0Rtv4CU9Fcit2/8cgAAAAASUVORK5CYII=";

var imageName = 'image1';
sequencer.loadImages(imageName, image);

test('benchmark all modules',function(t){

  var start, end;

  console.log("############ Benchmarks ############");

  Object.keys(sequencer.modules).forEach(function forEachModule(moduleName) {
    start = Date.now();
    sequencer.addSteps(moduleName);
    end = Date.now();
    console.log("Module " + moduleName + " ran in: " + (end-start) + " milliseconds");
    sequencer.removeSteps(imageName, 0); // remove the step after we're done
  });

  console.log("####################################");

});
