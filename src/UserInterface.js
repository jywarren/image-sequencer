/*
 * Default UI for each image-sequencer module
 */
module.exports = function UserInterface(UI,options) {

  return function userInterface(identity) {

    var UI = UI || {};

    UI.setup = UI.setup || function() {
      if(options.ui == "none") {
        // No UI
      }
      else if(options.inBrowser) {
        // Create and append an HTML Element
        console.log("Added Step \""+identity.stepName+"\" to \""+identity.imageName+"\".");
      }
      else {
        // Create a NodeJS Object
        console.log('\x1b[36m%s\x1b[0m',"Added Step \""+identity.stepName+"\" to \""+identity.imageName+"\".");

      }
    }

    UI.drawing = UI.drawing || function() {
      if(options.inBrowser) {
        // Overlay a loading spinner
        console.log("Drawing Step \""+identity.stepName+"\" on \""+identity.imageName+"\".");
      }
      else {
        // Don't do anything
        console.log('\x1b[33m%s\x1b[0m',"Drawing Step \""+identity.stepName+"\" on \""+identity.imageName+"\".");
      }
    }

    UI.drawn = UI.drawn || function(output) {
      if(options.inBrowser) {
        // Update the DIV Element
        // Hide the laoding spinner
        console.log("Drawn Step \""+identity.stepName+"\" on \""+identity.imageName+"\".");
      }
      else {
        // Update the NodeJS Object
        console.log('\x1b[32m%s\x1b[0m',"Drawn Step \""+identity.stepName+"\" on \""+identity.imageName+"\".");
      }
    }

    UI.remove = UI.remove || function() {
      if(options.inBrowser) {
        // Remove the DIV Element
        console.log("Removing Step \""+identity.stepName+"\" of \""+identity.imageName+"\".");
        image.remove();
      }
      else {
        // Delete the NodeJS Object
        console.log('\x1b[31m%s\x1b[0m',"Removing Step \""+identity.stepName+"\" of \""+identity.imageName+"\".");
      }
    }

    return UI;

  }

}
