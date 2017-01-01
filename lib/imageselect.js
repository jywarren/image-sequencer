function imageselect(options) {

  // fake jQuery-like DOM selector
  $ = $ || function $(query){
    return document.querySelector(query);
  }

  options = options || {};
  options.selector = options.selector || "#dropzone";
  options.output = options.output || function output(image) {
    return image;
  }

  var image;

  // CSS UI

  $(options.selector).on('dragenter',function(e) {
    $(options.selector).addClass('hover');
  });

  $(options.selector).on('dragleave',function(e) {
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

        // this is done once per image:
        options.output(event.target.result);
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

}
