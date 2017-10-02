window.onload = function() {

  sequencer = ImageSequencer();

  // Load information of all modules (Name, Inputs, Outputs)
  var modulesInfo = sequencer.modulesInfo();

  // Add modules to the addStep dropdown
  for(var m in modulesInfo) {
    $('#addStep select').append(
      '<option value="'+m+'">'+modulesInfo[m].name+'</option>'
    );
  }

  // Initial definitions
  var steps = document.querySelector('#steps');
  var parser = new DOMParser();
  var reader = new FileReader();
  initial = "images/grid.png";

  // Set the UI in sequencer. This Will generate HTML based on
  // Image Sequencer events :
  // onSetup : Called every time a step is added
  // onDraw : Called every time a step starts draw
  // onComplete : Called every time a step finishes drawing
  // onRemove : Called everytime a step is removed
  // The variable 'step' stores useful data like input and
  // output values, step information.
  // See documetation for more details.
  sequencer.setUI({

    onSetup: function(step) {

      step.ui = '\
      <div class="row step">\
        <div class="col-md-4 details">\
          <h3>'+step.name+'</h3>\
          <p><i>'+(step.description || '')+'</i></p>\
        </div>\
        <div class="col-md-8">\
          <img alt="" class="img-thumbnail"/>\
        </div>\
      </div>\
      ';

      var tools =
      '<div class="tools btn-group">\
         <button confirm="Are you sure?" class="remove btn btn-xs btn-default">\
           <i class="fa fa-trash"></i>\
         </button>\
      </div>';

      step.ui = parser.parseFromString(step.ui,'text/html');
      step.ui = step.ui.querySelector('div.row');
      step.imgElement = step.ui.querySelector('img');

      if(sequencer.modulesInfo().hasOwnProperty(step.name)) {
        var inputs = sequencer.modulesInfo(step.name).inputs;
        var outputs = sequencer.modulesInfo(step.name).outputs;
        var io = Object.assign(inputs,outputs);
        for (var i in io) {
          var div = document.createElement('div');
          div.className = "row";
          div.setAttribute('name',i);
          div.innerHTML = "<div class='det'>" + i + ": " + "<span></span></div>";
          step.ui.querySelector('div.details').appendChild(div);
        }
      }

      if(step.name != "load-image")
        step.ui.querySelector('div.details').appendChild(
          parser.parseFromString(tools,'text/html')
                .querySelector('div')
        );

      steps.appendChild(step.ui);
    },

    onComplete: function(step) {

      step.imgElement.src = step.output;

      if(sequencer.modulesInfo().hasOwnProperty(step.name)) {
        var inputs = sequencer.modulesInfo(step.name).inputs;
        var outputs = sequencer.modulesInfo(step.name).outputs;
        for (var i in inputs) {
          step.ui.querySelector('div[name="'+i+'"] span')
            .innerHTML = step.options[i];
        }
        for (var i in outputs) {
          step.ui.querySelector('div[name="'+i+'"] span')
            .innerHTML = step[i];
        }
      }

    },

    onRemove: function(step) {
      step.ui.remove();
    }

  });

  sequencer.loadImage('images/grid.png', function loadImageUI(){

    // look up needed steps from Url Hash:
    var stepsFromHash = getUrlHashParameter('steps').split(',')
    stepsFromHash.forEach(function eachStep(step) {
      sequencer.addSteps(step)
    });
    sequencer.run();

  });


  // File handling

  $('#addStep select').on('change', selectNewStepUI);

  function selectNewStepUI() {
    $('#options').html('');
    var m = $('#addStep select').val();
    for(var input in modulesInfo[m].inputs) {
      $('#options').append(
        '<div class="row">\
           <div class="col-md-5 labels">\
             '+input+':\
           </div>\
           <div class="col-md-5">\
             <input class="form-control" type="text" name="'+input+'" value="" placeholder="'+
             modulesInfo[m].inputs[input].default+'"/>\
           </div>\
         </div>'
      );
    }
  }


  function addStepUI() {
    var options = {};
    var inputs = $('#options input');
    $.each(inputs, function() {
      options[this.name] = $(this).val();
    });
    if($('#addStep select').val()=="none") return;
    // add to URL hash too
    setUrlHashParameter('steps', getUrlHashParameter('steps') + ',' + $('#addStep select').val())
    sequencer.addSteps($('#addStep select').val(),options).run();
  }

  $('#addStep button').on('click', addStepUI);


  function removeStepUI(){
    var index = $('button.remove').index(this) + 1;
    sequencer.removeSteps(index).run();
    // remove from URL hash too
    var urlHash = getUrlHashParameter('steps').split(',');
    urlHash.splice(index - 1, 1);
    setUrlHashParameter("steps", urlHash.join(','));
  }

  $('body').on('click','button.remove', removeStepUI);


  // File handling

  function handleFile(e) {

    e.preventDefault();
    e.stopPropagation(); // stops the browser from redirecting.

    if (e.target && e.target.files) var file = e.target.files[0];
    else var file = e.dataTransfer.files[0];
    if(!file) return;

    reader.onload = function(){
      var loadStep = sequencer.images.image1.steps[0];
      loadStep.output.src = reader.result;
      sequencer.run(0);
      loadStep.options.step.imgElement.src = reader.result;
    }

    reader.readAsDataURL(file);
  }

  $('#file').on('change', handleFile);

  var select = $('#imageSelect');

  select[0].addEventListener('drop', handleFile, false);

  select.on('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }, false);

  select.on('dragenter', function(e) {
    select.addClass('hover');
  });

  select.on('dragleave', function(e) {
    select.removeClass('hover');
  });

}
