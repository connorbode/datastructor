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
  if (node._type !== 'Node' && node._type !== 'LinkableNode' && node._type !== 'Tree')
    throw "Only Nodes, LinkableNodes and Trees can be added to NodeCollections";

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
  if (index === -1)
    return;
  
  this.nodes.splice(index, 1);
};


/**
 * Organizes the node collection
 */
NodeCollection.prototype._sitPretty = function () {
  var sep = 100;
  var leftOffset = (this.nodes.length - 1) * sep / 2;
  this.nodes.forEach(function (node, index) {
    var x = sep * index - leftOffset;
    var y = 0;
    node.setCoordinates(new TwoDee.Point(x, y));
  });
};

/**
 * Checks whether the collection contains the specified element
 */
NodeCollection.prototype.contains = function (node) {

  // typecheck 
  if (node._type !== 'Node' && node._type !== 'LinkableNode')
    return false;

  // find the node
  var index = this.nodes.indexOf(node);
  return index > -1;
};

module.exports = NodeCollection;