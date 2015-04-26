var DomainObject  = require('./DomainObject');
var TwoDee        = require('two-dee');

var Collection = function (container) {

  // call the parent constructor
  DomainObject.call(this, 'Collection', container);

  // set defaults
  this.nodes = [];
  this.stack = 'horizontal';
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

  // set the appropriate transition duration
  // node.setTransitionDuration(this.duration);

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
 * Sets the stacking to horizontal
 */
Collection.prototype.setHorizontal = function () {
  this.stack = 'horizontal';
  this._sitPretty();
};

/**
 * Sets the stacking to vertical
 */
Collection.prototype.setVertical = function () {
  this.stack = 'vertical';
  this._sitPretty();
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
    var point;
    if (this.stack === 'horizontal')
      point = new TwoDee.Point(x, y);
    else
      point = new TwoDee.Point(y, x);
    node.setCoordinates(point);
  }.bind(this));
};

/**
 * Checks whether the collection contains the specified element
 */
Collection.prototype.contains = function (node) {

  // find the node
  var index = this.nodes.indexOf(node);
  return index > -1;
};

/**
 * Sets the transition duration for a collection
 */
Collection.prototype.setTransitionDuration = function (duration) {
  this.duration = duration;
  this.nodes.forEach(function (node) {
    node.setTransitionDuration(duration);
  });
};

/**
 * SHOULD NOT BE CALLED DIRECTLY
 *
 * Adds a listener to the collection
 */
Collection.prototype._addEvent = function (event, eventStr, callback) {

};

/**
 * SHOULD NOT BE CALLED DIRECTLY
 *
 * Removes a listener from the collection
 */
Collection.prototype._removeEvent = function (event, eventStr, callback) {

};

module.exports = Collection;