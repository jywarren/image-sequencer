/*
 * User Interface Handling Module
 */

module.exports = function UserInterface(events = {}) {

  events.onSetup = events.onSetup || function(step) {
    console.log("onSetup "+step.name);
  }

  events.onDraw = events.onDraw || function(step) {
    console.log("onDraw "+step.name);
  }

  events.onComplete = events.onComplete || function(step) {
    console.log("onComplete "+step.name);
  }

  events.onRemove = events.onRemove || function(step) {
    console.log("onRemove "+step.name);
  }

  return events;

}
