describe('Default sequencer HTML', function() {

  var DefaultHtmlSequencerUi = require('../../../examples/lib/defaultHtmlSequencerUi');
  var sequencer = require('../../../src/ImageSequencer')();
  var defaultHtmlSequencerUi;

  beforeEach(()=>{
    defaultHtmlSequencerUi = new DefaultHtmlSequencerUi(sequencer);

    spyOn(defaultHtmlSequencerUi, 'onLoad');
    spyOn(defaultHtmlSequencerUi, 'selectNewStepUi');
    spyOn(defaultHtmlSequencerUi, 'removeStepUi');
    spyOn(defaultHtmlSequencerUi, 'addStepUi');
    spyOn(defaultHtmlSequencerUi, 'importStepsFromUrlHash');

    defaultHtmlSequencerUi.onLoad();
    defaultHtmlSequencerUi.selectNewStepUi();
    defaultHtmlSequencerUi.addStepUi();
    defaultHtmlSequencerUi.removeStepUi();
    defaultHtmlSequencerUi.importStepsFromUrlHash();
  });

  it('load default ui', function() {
    expect(defaultHtmlSequencerUi.onLoad).toHaveBeenCalled();
  });

  it('select step ui', function() {
    expect(defaultHtmlSequencerUi.selectNewStepUi).toHaveBeenCalled();
  });

  it('add step ui', function() {
    expect(defaultHtmlSequencerUi.addStepUi).toHaveBeenCalled();
  });

  it('remove step ui', function() {
    expect(defaultHtmlSequencerUi.removeStepUi).toHaveBeenCalled();
  });

  it('import options from url', function() {
    expect(defaultHtmlSequencerUi.importStepsFromUrlHash).toHaveBeenCalled();
  });
  
  xit('adds a step from the quick selector', function() {
    expect($('.step').length).toBe(1);
    $("[data-value='brightness']").click()
    expect($('.step').length).toBe(2);
    // expect($('.step:last img'))[0].src).not.toEqualTo($('.step:first img'));
    // TODO: test the actual `src` attribute of $('.step:last img') against a known value
  });
});
