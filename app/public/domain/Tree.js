var DomainObject = require('./DomainObject');

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
    this.root.createLink(child);

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

};


module.exports = Tree;