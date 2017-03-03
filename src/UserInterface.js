/*
 * Default UI for each image-sequencer module
 */
module.exports = function UserInterface(options) {

  options = options || {};
  options.container = options.container || ".panels";

  options.random = options.random || parseInt(Math.random() * (new Date()).getTime() / 1000000);
  options.uniqueSelector = options.uniqueSelector || options.selector + '-' + options.random; 
  $(options.container).append('<div class="panel ' + options.selector + ' ' + options.uniqueSelector + '"></div>');
  options.el = options.el || $('.' + options.uniqueSelector);
  createLabel(options.el);

  // method to remove the UI for a given method, and remove the step
  function display(image) {
    options.el.html(image);
  }

  // method to remove the UI for a given method, and remove the step
  function remove() {}

  // method to reorder steps, and update the UI
  //function move() {}

  function createLabel(el) {
console.log("createLabel", module.title)
    el.append('<h3 class="title">' + module.title + '</h3>');
  }

  return {
    el: options.el,
    uniqueSelector: options.uniqueSelector,
    selector: options.selector,
    display: display,
    remove: remove
  }

}
