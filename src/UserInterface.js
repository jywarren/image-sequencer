/*
 * Default UI for ImageBoard
 */
module.exports = function UserInterface(options) {

  options = options || {};
  options.container = options.container || ".panels";

  // method to create a UI for a given module
  function create(o) {
    o.random = o.random || parseInt(Math.random() * (new Date()).getTime() / 1000000);
    o.uniqueSelector = o.uniqueSelector || o.selector + '-' + o.random; 
    $(options.container).append('<div class="panel ' + o.selector + ' ' + o.uniqueSelector + '"></div>');
    o.el = o.el || $('.' + o.uniqueSelector);
    return {
      el: o.el,
      uniqueSelector: o.uniqueSelector,
      selector: o.selector
    }
  }

  // method to remove the UI for a given method, and remove the step
  function remove() {

  }

  // method to reorder steps, and update the UI
  //function move() {

  //}

  return {
    create: create,
    remove: remove
  }

}
