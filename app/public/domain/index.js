var uuid = require('node-uuid');
var DomainObject = require('./DomainObject');

module.exports = {
  Collection:     require('./Collection'),
  genId:          DomainObject.genId,
  getObject:      DomainObject.getObject,
  Link:           require('./Link'),
  LinkableNode:   require('./LinkableNode'),
  Node:           require('./Node'),
  Tree:           require('./Tree')
};