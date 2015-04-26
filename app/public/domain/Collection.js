var DomainObject  = require('./DomainObject');
var TwoDee        = require('two-dee');

var Collection = function (container) {

  // call the parent constructor
  DomainObject.call(this, 'Collection', container);

  // set defaults
  this.nodes = [];
};

// Inherit from Domain Object
Collection.prototype = Object.create(DomainObject.prototype);
Collection.prototype.constructor = Node;

/**
 * Adds a node to the collection
 *
 * - `node` should be a LinkableNode or a Node
 */

Collection.prototype.add = function (node) {

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
Collection.prototype.remove = function (node) {

  // find the node in the collection
  var index = this.nodes.indexOf(node);
  if (index === -1)
    return;
  
  this.nodes.splice(index, 1);
};


/**
 * Organizes the node collection
 */
Collection.prototype._sitPretty = function () {
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
Collection.prototype.contains = function (node) {

  // find the node
  var index = this.nodes.indexOf(node);
  return index > -1;
};

module.exports = Collection;