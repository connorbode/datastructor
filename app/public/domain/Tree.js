var DomainObject  = require('./DomainObject');
var TwoDee        = require('two-dee');

var Tree = function (container) {
  
  // call the parent constructor
  DomainObject.call(this, 'Tree', container);

  // set defaults
  this.root = null;
  this.children = [];
};

Tree.prototype = Object.create(DomainObject);
Tree.prototype.constructor = Tree;

/**
 * Sets the root node of the tree
 * - `root` should be an instance of a LinkableNode
 */

Tree.prototype.setRoot = function (root) {
  
  // typecheck
  if (root !== null && root._type !== 'LinkableNode')
    throw "Root of a tree can only be a LinkableNode (or null)!";

  // set the root
  this.root = root;

  // move the root to this tree's svg group
  var group = root.group.remove();
  this.group.node().appendChild(group.node());
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
  children.forEach(function (child) {
    if (child._type !== 'LinkableNode' && child._type !== 'Tree')
      throw err;
  });

  // verify root is set
  if (!this.root)
    throw "cannot add children before setting root!";

  this.children = children;
  this.children.forEach(function (child) {

    // create a link from the root to the child
    if (child._type === 'Tree') {
      this.root.createLink(child.root);
    }
    else if (child._type === 'LinkableNode') {
      this.root.createLink(child);
    }

    // move the child to this tree's svg group
    var group = child.group.remove();
    this.group.node().appendChild(child.group.node());
  }.bind(this));
};


/**
 * Checks whether a tree is empty
 */

Tree.prototype.isEmpty = function () {
  return this.children.length === 0;
};

/**
 * Appends a child to a the tree
 * - `child` should be an instance of a LinkableNode or a Tree
 */
Tree.prototype.addChild = function (child) {

  // typecheck
  if (child._type !== 'LinkableNode' && child._type !== 'Tree')
    throw "Child must be a LinkableNode or a Tree!";

  // verify root is set
  if (!this.root)
    throw "cannot add children before setting root!";

  this.children.push(child);
  this.root.createLink(child);
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
 * Organizes the nodes of the tree (by spacing them appropriately)
 */
Tree.prototype.sitPretty = function () {

  // get the measurements for the levels
  var measurements = this._getMeasurements(this);
  var rootX = measurements.width / 2;
  var rootY = 0;
  var rootPoint = new TwoDee.Point(rootX, rootY);
  this.root.setCoordinates(rootPoint);
  this._organizeLevel(measurements);
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
  var rootPoint = this.root.node.center;
  var dx = point.x - rootPoint.x;
  var dy = point.y - rootPoint.y;
  var linkableNodesToMove = [this.root];
  linkableNodesToMove.forEach(function (linkableNode) {
    var newPoint = linkableNode.node.center;
    newPoint.x += dx;
    newPoint.y += dy;
    linkableNode.setCoordinates(newPoint);
  });
};



module.exports = Tree;