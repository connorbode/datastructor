var DomainObject  = require('./DomainObject');
var TwoDee        = require('two-dee');

var NodeCollection = function (container) {

  // call the parent constructor
  DomainObject.call(this, 'NodeCollection', container);

  // set defaults
  this.nodes = [];
};

// Inherit from Domain Object
Node.prototype = Object.create(DomainObject.prototype);
Node.prototype.constructor = Node;

/**
 * Adds a node to the collection
 *
 * - `node` should be a LinkableNode or a Node
 */

NodeCollection.prototype.add = function (node) {

  // typecheck
  if (node._type !== 'Node' && node._type !== 'LinkableNode')
    throw "Only Nodes and LinkableNodes can be added to NodeCollections";

  // add the node to the collection
  this.nodes.push(node);

  // remove the node from the DOM and add it to this group
  node.group.node().remove();
  this.group.node().appendChild(node.group.node());

  // re-center the nodes
  this._sitPretty();
};

/** 
 * Removes a node from the collection
 *
 * - `node` should be a LinkableNode or a Node
 */
NodeCollection.prototype.remove = function (node) {

  // typecheck
  if (node._type !== 'Node' && node._type !== 'LinkableNode')
    return;

  // find the node in the collection
  var index = this.nodes.indexOf(node);
  this.nodes[index].node().remove();
  this.nodes.splice(index, 1);
};

NodeCollection.prototype._sitPretty = function () {

  this.nodes.forEach(function (node, index) {
    var x = 100 * index;
    var y = 0;
    node.setCoordinates(new TwoDee.Point(x, y));
  });
};

module.exports = NodeCollection;