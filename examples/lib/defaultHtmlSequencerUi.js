function DefaultHtmlSequencerUi(_sequencer, options) {

  options = options || {};
  var addStepSel = options.addStepSel = options.addStepSel || "#addStep";
  var removeStepSel = options.removeStepSel = options.removeStepSel || "button.remove";
  var selectStepSel = options.selectStepSel = options.selectStepSel || "#selectStep";

  function onLoad() {
    importStepsFromUrlHash();
  }

  // look up needed steps from Url Hash:
  function importStepsFromUrlHash() {
    var hash = getUrlHashParameter("steps");

    if (hash) {
      var stepsFromHash = _sequencer.importStringtoJson(hash);
      stepsFromHash.forEach(function eachStep(stepObj) {
        _sequencer.addSteps(stepObj.name,stepObj.options);
      });
      _sequencer.run();
    }
    setUrlHashParameter("steps", sequencer.toString());
  }

  function selectNewStepUi() {
    var m = $(addStepSel + " select").val();
    $(addStepSel + " .info").html(_sequencer.modulesInfo(m).description);
  }

  function removeStepUi() {
    var index = $(removeStepSel).index(this) + 1;
    sequencer.removeSteps(index).run();
    // remove from URL hash too
    setUrlHashParameter("steps", sequencer.toString());
  }

  function addStepUi() {
    if ($(addStepSel + " select").val() == "none") return;

    var newStepName = $(addStepSel + " select").val();
    _sequencer
    .addSteps(newStepName, options)
    .run(null);

    // add to URL hash too
    setUrlHashParameter("steps", _sequencer.toString());
  }

  return {
    onLoad: onLoad,
    importStepsFromUrlHash: importStepsFromUrlHash,
    selectNewStepUi: selectNewStepUi,
    removeStepUi: removeStepUi,
    addStepUi: addStepUi
  }
}
