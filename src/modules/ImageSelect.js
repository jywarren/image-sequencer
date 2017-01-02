/*
 * Special module to kick off the sequence
 *  -- depends on jQuery for interface setup & drag & drop
 */
module.exports = function ImageSelect(options) {

  options = options || {};
  options.selector = options.selector || "#drop";
  options.output = options.output || function output(image) {
    return image;
  }

  var image;

  // CSS UI

  $(options.selector).on('dragenter', function(e) {
    $(options.selector).addClass('hover');
  });

  $(options.selector).on('dragleave', function(e) {
    $(options.selector).removeClass('hover');
  });

  // Drag & Drop behavior

  var onDrop = function(e) {
    e.preventDefault();
    e.stopPropagation(); // stops the browser from redirecting.

    var files = e.dataTransfer.files;
    for (var i = 0, f; f = files[i]; i++) {
      // Read the File objects in this FileList.

      reader = new FileReader()
      reader.onload = function(e) {
        // we should trigger "load" event here

        image = new Image();
        image.src = event.target.result;

        $(options.selector).html(image);

        // this is done once per image:
        options.output(image);
      }
      reader.readAsDataURL(f);
 
    }
  }

  function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  $(options.selector).on('dragover', onDragOver, false);
  $(options.selector)[0].addEventListener('drop', onDrop, false);

  function getImage() {
    return image;
  }

  return {
    getImage: getImage
  }

}
