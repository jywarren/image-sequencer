/*
 * Special module to kick off the sequence
 *  -- depends on jQuery for interface setup & drag & drop
 */
module.exports = function ImageSelect(options) {

  options = options || {};
  options.selector = options.selector || "#drop";
  options.inputSelector = options.inputSelector || "#file-select";
  options.ui = options.ui || {};
  options.ui.el = options.ui.el || $(options.selector);

  var image,
      el = options.ui.el;

  function setup() {

    // CSS UI
    el.on('dragenter', function(e) {
      el.addClass('hover');
    });

    el.on('dragleave', function(e) {
      el.removeClass('hover');
    });

    // Drag & Drop behavior
    function onImage(e) {
      e.preventDefault();
      e.stopPropagation(); // stops the browser from redirecting.

      var files;
      if (e.target && e.target.files) files = e.target.files;
      else files = e.dataTransfer.files;

      for (var i = 0, f; f = files[i]; i++) {
        // Read the File objects in this FileList.

        reader = new FileReader();
        reader.onload = function(e) {
          // we should trigger "load" event here

          image = new Image();
          image.src = event.target.result;

          el.html(image); // may be redundant

          // this is done once per image:
          options.onComplete(image);
        }
        reader.readAsDataURL(f);

      }
    }

    function onDragOver(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    el.on('dragover', onDragOver, false);
    el[0].addEventListener('drop', onImage, false);
    $(options.inputSelector).change(onImage);

  }

  function draw(_image) {
    if (options.onComplete) options.onComplete(image);
  }

  function get() {
    return image;
  }

  return {
    title: "Select image",
    options: options,
    draw: draw,
    setup: setup,
    get: get
  }

}
