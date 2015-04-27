var DomainObject  = require('./DomainObject');
var TwoDee        = require('two-dee');

var Collection = function (container) {

  // call the parent constructor
  DomainObject.call(this, 'Collection', container);

  // set defaults
  this.nodes = [];
  this.stack = 'horizontal';
  this.separation = 0;
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

  // add a hook for node changes
  node.addEventListener('changed', this._sitPretty.bind(this));

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
  
  // remove the change listener from the node
  this.nodes[index].removeEventListener('changed', this._sitPretty.bind(this));

  // remove the node
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

  // get the bboxes for all elements
  var bboxes = this.nodes.map(function (node) {
    return node.group.node().getBBox();
  });

  // get the total widths of the elements contained
  var totalWidth = bboxes.reduce(function (width, bbox) {
    return width + bbox.width;
  }, 0);

  // get the total height of the elements contained
  var totalHeight = bboxes.reduce(function (height, bbox) {
    return height + bbox.height;
  }, 0);

  // the total separation amount
  var totalSeparation = (this.nodes.length - 1) * this.separation;

  // set the offset of each group member
  if (this.stack === 'horizontal') {
    var currentOffset = - (totalWidth + totalSeparation) / 2;
    this.nodes.forEach(function (node, index) {
      var bbox = node.group.node().getBBox();
      var point = new TwoDee.Point(currentOffset, 0);
      node.setCoordinates(point);
      currentOffset += bbox.width + this.separation;
    }.bind(this));
  } 

  else {
    var currentOffset = - (totalHeight + totalSeparation) / 2;
    this.nodes.forEach(function (node, index) {
      var bbox = node.group.node().getBBox();
      var point = new TwoDee.Point(0, currentOffset);
      node.setCoordinates(point);
      currentOffset += bbox.height + this.separation;
    }.bind(this));
  }
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
 * Sets the separation for a collection
 */
Collection.prototype.setSeparation = function (separation) {
  this.separation = separation;
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