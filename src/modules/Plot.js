/*
 * Plot image on a graph with color bar
 */
module.exports = function Plot(options) {

  options = options || {};

  var image,
      selector = 'mod-plot',
      random = options.random || parseInt(Math.random() * (new Date()).getTime() / 1000000),
      uniqueSelector = selector + '-' + random, 
      el;

  // should we just run setup on constructor?
  function setup() {

    $(options.container).append('<div class="panel ' + selector + ' ' + uniqueSelector + '"></div>');
    el = $('.' + uniqueSelector);

  }

  function run(_image, onComplete, options) {

    options = options || {};
    options.colorscale = options.colorscale || 'Jet',//'RdBu';
    options.type = options.type || 'contour'; // or 'heatmap'

    /* https://plot.ly/javascript/heatmap-and-contour-colorscales/#custom-colorscale
  type: 'contour',
  colorscale: [[0,    'rgb(166,206,227)'], 
               [0.25, 'rgb(31,120,180)'], 
               [0.45, 'rgb(178,223,138)'], 
               [0.65, 'rgb(51,160,44)'], 
               [0.85, 'rgb(251,154,153)'], 
               [1,    'rgb(227,26,28)']]
    */

    var Plotly = require('plotly.js'),
        getPixels = require("get-pixels");

    var data = [{
      z: [],
      colorscale: options.colorscale,
      type: 'heatmap'
    }];

    getPixels(_image.src, function(err, pixels) {

      if(err) {
        console.log("Bad image path")
        return
      }

      for(var y = pixels.shape[1]; y > 0; y--) {
        data[0].z.push([]);
        for(var x = 1; x < pixels.shape[0]; x++) {

          data[0].z[data[0].z.length - 1].push(pixels.get(x, y, 0) / 255.00);

        }
      }

      var layout = { title: '' };
      el.append('<div id="plot-' + random + '"></div>');
      Plotly.newPlot('plot-' + random, data, layout);

      // return Plotly.toImage(gd,{format:'jpeg',height:400,width:400});

    });

  }

  return {
    title: "Plot with colorbar",
    run: run,
    setup: setup,
    image: image
  }
}
