var uuid = require('node-uuid');

if (!window.Datastructor) {
  window.Datastructor = {};
}

if (!window.Datastructor.objects) {
  window.Datastructor.objects = {};
}

/**
 * Retrieves an object by ID
 */
var getObject = function (id) {
  return window.Datastructor.objects[id];
};

/**
 * Generates an ID
 */
var genId = function () {
  return uuid.v4();
};


module.exports = {
  genId:          genId,
  getObject:      getObject,
  Link:           require('./Link'),
  LinkableNode:   require('./LinkableNode'),
  Node:           require('./Node'),
  NodeCollection: require('./NodeCollection'),
  Tree:           require('./Tree')
};