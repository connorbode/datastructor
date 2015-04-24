var DomainObject  = require('./DomainObject');
var Node          = require('./Node');
var Link          = require('./Link');
var TwoDee        = require('two-dee');

var LinkableNode = function (container) {

  // call the parent constructor
  DomainObject.call(this, 'LinkableNode', container);

  // append the draggable link
  this.draggableLink = new Link(this.group);
  this.draggableLink.setTransitionDuration(0);
  this.draggableLink.hide();

  // append a node
  this.node = new Node(this.group);
  this.node.addEventListener('mousedown', this._startDragging.bind(this));

};

// inherit from DomainObject
LinkableNode.prototype = Object.create(DomainObject.prototype);
LinkableNode.prototype.constructor = LinkableNode;

/** 
 * Starts dragging the link
 */
LinkableNode.prototype._startDragging = function () {
  d3.event.stopPropagation();
  this.draggableLink.show();
  var win = d3.select(window);
  win.on('mousemove', this._onDrag.bind(this));
  win.on('mouseup', this._endDragging.bind(this));
  this._onDrag();
};

/**
 * Responds to link dragging
 */
LinkableNode.prototype._onDrag = function () {
  var e = d3.event;

  // get the window offset of the node
  var boundingRect = this.node.group.node().getBoundingClientRect();
  var offsetLeft = boundingRect.left + boundingRect.width / 2;
  var offsetTop = boundingRect.top + boundingRect.height / 2;

  // set the arrowhead coordinates
  var x = e.clientX - offsetLeft;
  var y = e.clientY - offsetTop;
  var point = new TwoDee.Point(x, y);
  var start = this.draggableLink.start;
  this.draggableLink.setCoordinates(start, point);
};

/**
 * Ends dragging the link
 */
LinkableNode.prototype._endDragging = function () {
  var win = d3.select(window);
  win.on('mousemove', null);
  win.on('mouseup', null);
  this.draggableLink.hide();
};

/** 
 * Sets the center of the node
 */
LinkableNode.prototype.setCoordinates = function (point) {
  var end = this.draggableLink.end;
  this.draggableLink.setCoordinates(point, end);
  this.node.setCoordinates(point);
};

/**
 * Sets the value of the node
 */
LinkableNode.prototype.setValue = function (value) {
  this.node.setValue(value);
};

module.exports = LinkableNode;