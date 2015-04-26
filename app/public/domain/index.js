var uuid = require('node-uuid');
var DomainObject = require('./DomainObject');

module.exports = {
  genId:          DomainObject.genId,
  getObject:      DomainObject.getObject,
  Link:           require('./Link'),
  LinkableNode:   require('./LinkableNode'),
  Node:           require('./Node'),
  NodeCollection: require('./NodeCollection'),
  Tree:           require('./Tree')
};