var DomainObject  = require('./DomainObject');
var LinkableNode  = require('./LinkableNode');
var TwoDee        = require('two-dee');
var Promise       = require('es6-promise').Promise;

var Tree = function (container) {
  
  // call the parent constructor
  DomainObject.call(this, 'Tree', container);

  // set defaults
  this.parent = null;
  this.children = [];

  // event dispatcher
  this.dispatcher = d3.dispatch('valuechanged', 'linkcreated', 'moved');

  // add the node
  this.node = new LinkableNode(this.group);
  this.node.addEventListener('valuechanged', this._emitValueChanged.bind(this));
  this.node.addEventListener('linkcreated', this._emitLinkCreated.bind(this));
};

Tree.prototype = Object.create(DomainObject.prototype);
Tree.prototype.constructor = Tree;

/** 
 * Sets the parent tree of this tree
 * - `parent` should be an instance of a Tree
 */
Tree.prototype.setParent = function (tree) {
  this.parent = tree;
};

/**
 * Sets the children of the tree
 * - `children` should be an array containing only instances of LinkableNodes and Trees
 */

Tree.prototype.setChildren = function (children) {

  // typecheck
  var err = "Children must an array of LinkableNodes and Trees!"
  if (!Array.isArray(children))
    throw err;

  // typecheck all objects in the array
  children.forEach(function (child) {
    if (child._type !== 'LinkableNode' && child._type !== 'Tree')
      throw err;
  });

  // blabla
  this.children = children;
  this.children.forEach(this.addChild.bind(this));
};


/**
 * Checks whether a tree is empty
 */

Tree.prototype.isEmpty = function () {
  return this.children.length === 0;
};

/**
 * Appends a child to a the tree
 * - `child` should be an instance of a Tree
 */
Tree.prototype.addChild = function (child) {

  // typecheck
  if (child._type !== 'Tree')
    throw "Child must be a Tree!";

  // create a link from the root to the child
  var transition = this.node.createLink(child.node);
  this.node.setTransitionDuration(1000);

  // set the parent in the child
  child.setParent(this);

  // move the child to this tree's svg group
  var group = child.group.remove();
  this.group.node().appendChild(child.group.node());
  this.children.push(child);

  return transition;
};

/**
 * Removes a child from the tree
 * - `child` should be an instance of a LinkableNode or a Tree
 */
Tree.prototype.removeChild = function (child) {

  // typecheck
  if (child._type !== 'LinkableNode' && child._type !== 'Tree')
    return;

  var index = this.children.indexOf(child);
  if (index > -1)
    return this.children.splice(index, 1);
};

/**
 * SHOULD NOT BE CALLED DIRECTLY
 *
 * Organizes the nodes of the tree (by spacing them appropriately)
 */
Tree.prototype._sitPretty = function () {

  // get the measurements for the levels
  var measurements = this._getMeasurements(this);
  var rootX = measurements.width / 2;
  var rootY = 0;
  var rootPoint = new TwoDee.Point(rootX, rootY);
  var promise = this.node.setCoordinates(rootPoint);
  this._organizeLevel(measurements);

  return promise;
};


/** 
 * Finds the root of the tree
 */
Tree.prototype.getRoot = function () {
  var curr = this;
  while(curr.parent !== null) {
    curr = curr.parent;
  }
  return curr;
};

/**
 * Finds the root of the tree, then calls _sitPretty
 * to organize the entire tree
 */
 
Tree.prototype.sitPretty = function () {
  var promise = this.getRoot()._sitPretty();
  return promise;
};

/**
 * SHOULD NOT BE CALLED DIRECTLY
 *
 * Organizes a level of the tree (by spacing it according to measurements)
 * - `measurements` should be a Measurement object as produced by Tree._getChildMeasurements
 * - `level` should be the depth of the node
 */

Tree.prototype._organizeLevel = function (measurements, level) {

  if (!level)
    level = 1;

  var totalX = measurements.totalX || 0;
  this.children.forEach(function (child, index) {
    var measurement = measurements.children[index];
    var thisX = measurement.width / 2;
    var x = totalX + thisX;
    var y = level * 80;
    var point = new TwoDee.Point(x, y);

    measurement.totalX = totalX;
    totalX += measurement.width;

    child.setCoordinates(point);

    if (child._type === 'Tree') {
      child._organizeLevel(measurement, level + 1);
    }
  });
};

/**
 * SHOULD NOT BE CALLED DIRECTLY
 *
 * Gets the measurements of a node including width's at 
 * each depth of the node
 * - `node` should be an instance of a LinkableNode or a Tree
 * - `m` should be an array of Measurements.
 */
Tree.prototype._getMeasurements = function (node) {
  var NODE_WIDTH = 100;

  // `width` should represent the width of this particular node
  // `children` should be an array of Measurement objects for this node's children
  var Measurement = function (width, children) {
    this.width = width;
    this.children = children;
  };

  // check the case that the node is a LinkableNode
  if (node._type === 'LinkableNode') {
    var measurement = new Measurement(NODE_WIDTH, []);
    return measurement;
  }

  // check the case that the node is a Tree
  if (node._type === 'Tree') {
    var children = node.children.map(node._getMeasurements.bind(node));
    var width;
    if (children.length === 0)
      width = NODE_WIDTH;
    else 
      width = children.reduce(function (sum, child) { return sum + child.width; }, 0);
    var measurement = new Measurement(width, children);
    return measurement;
  }
};

/**
 * Sets the coordinates of a trees root node
 */
Tree.prototype.setCoordinates = function (point) {
  var rootPoint = this.node.node.center;
  var dx = point.x - rootPoint.x;
  var dy = point.y - rootPoint.y;
  var center = this.node.node.center;
  center.x += dx;
  center.y += dy;

  var promise = this.node.setCoordinates(center);
  return promise;
};

/**
 * Sets the value of this tree
 */
Tree.prototype.setValue = function (value) {
  this.node.setValue(value);
};

/**
 * Adds an event listener; SHOULD NOT BE CALLED DIRECTLY
 */
Tree.prototype._addEvent = function (event, eventStr, callback) {

  // add the events
  if (this.dispatcher[event]) {
    this.dispatcher.on(eventStr, callback);
  }
};

/**
 * Removes an event listener; SHOULD NOT BE CALLED DIRECTLY
 */
Tree.prototype._removeEvent = function (event, eventStr, callback) {

  // remove the events
  if (this.dispatcher[event]) {
    this.dispatcher.on(eventStr, null);
  }
};


/**
 * Finds a tree that a given node belongs to.  If 
 * the node does not belong to a tree, return null.
 */
Tree.findTreeFromRoot = function (node) {
  if (node._isRoot) {
    var element = DomainObject.findElemOfType(node.group.node(), 'Tree');
    var id = element.getAttribute('data-id');
    return DomainObject.getObject(id);
  }
  return null;
};

/**
 * Re-emits the value changed event coming from the LinkableNode
 */
Tree.prototype._emitValueChanged = function (id, value) {
  this.dispatcher.valuechanged(this.id, value);
};

/**
 * Re-emits the link created event coming from the LinkableNode
 */
Tree.prototype._emitLinkCreated = function (id, otherId) {
  var otherObj = DomainObject.getObject(otherId);
  var otherDOM = otherObj.group.node();
  var treeDOM = DomainObject.findElemOfType(otherDOM, 'Tree');
  var treeId = treeDOM.getAttribute('data-id');
  var tree = DomainObject.getObject(treeId);
  this.dispatcher.linkcreated(this.id, tree.id);
};

/**
 * Sets the transition duration for a tree
 */
Tree.prototype.setTransitionDuration = function (duration) {
  this.node.setTransitionDuration(duration);
  this.children.forEach(function (child) {
    child.setTransitionDuration(duration);
  });
};


module.exports = Tree;