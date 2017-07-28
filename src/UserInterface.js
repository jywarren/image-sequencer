/*
 * Default UI for each image-sequencer module
 */
module.exports = function UserInterface(newUI = {},options) {

  var UI = newUI;

  return function userInterface(identity) {

    identity.ui = options.ui;
    identity.inBrowser = options.inBrowser;

    UI.onSetup = UI.onSetup || function(identity) {
      if(identity.ui == false) {
        // No UI
      }
      else if(identity.inBrowser) {
        // Create and append an HTML Element
        console.log("Added Step \""+identity.stepName+"\" to \""+identity.imageName+"\".");
      }
      else {
        // Create a NodeJS Object
        console.log('\x1b[36m%s\x1b[0m',"Added Step \""+identity.stepName+"\" to \""+identity.imageName+"\".");

      }
    }

    UI.onDraw = UI.onDraw || function(identity) {
      if (identity.ui == false) {
        // No UI
      }
      else if(identity.inBrowser) {
        // Overlay a loading spinner
        console.log("Drawing Step \""+identity.stepName+"\" on \""+identity.imageName+"\".");
      }
      else {
        // Don't do anything
        console.log('\x1b[33m%s\x1b[0m',"Drawing Step \""+identity.stepName+"\" on \""+identity.imageName+"\".");
      }
    }

    UI.onComplete = UI.onComplete || function(identity,output) {
      if (identity.ui == false) {
        // No UI
      }
      else if(identity.inBrowser) {
        // Update the DIV Element
        // Hide the laoding spinner
        console.log("Drawn Step \""+identity.stepName+"\" on \""+identity.imageName+"\".");
      }
      else {
        // Update the NodeJS Object
        console.log('\x1b[32m%s\x1b[0m',"Drawn Step \""+identity.stepName+"\" on \""+identity.imageName+"\".");
      }
    }

    UI.onRemove = UI.onRemove || function(identity) {
      if(identity.ui == false){
        // No UI
      }
      else if(identity.inBrowser) {
        // Remove the DIV Element
        console.log("Removing Step \""+identity.stepName+"\" of \""+identity.imageName+"\".");
      }
      else {
        // Delete the NodeJS Object
        console.log('\x1b[31m%s\x1b[0m',"Removing Step \""+identity.stepName+"\" of \""+identity.imageName+"\".");
      }
    }

    return UI;

  }

}
