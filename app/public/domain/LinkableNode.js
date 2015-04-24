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

  // show the draggable link
  this.draggableLink.show();
  this._onDrag();

  // add drag listeners to the window
  var win = d3.select(window);
  win.on('mousemove.LinkableNode', this._onDrag.bind(this));
  win.on('mouseup.LinkableNode', this._endDragging.bind(this));

  // add listeners to all other linkable nodes
  d3.selectAll('g.LinkableNode > g.Node')
    .on('mouseover.LinkableNode', this._onHoverOtherNode.bind(this));
};

/**
 * Responds to link dragging (sets arrowhead)
 */
LinkableNode.prototype._onDrag = function () {

  // if the arrow is snapped to another node, do nothing
  if (this._snap)
    return;

  // get the window offset of the node
  var boundingRect = this.node.group.node().getBoundingClientRect();
  var offsetLeft = boundingRect.left + boundingRect.width / 2;
  var offsetTop = boundingRect.top + boundingRect.height / 2;

  // set the arrowhead coordinates
  var x = d3.event.clientX - offsetLeft;
  var y = d3.event.clientY - offsetTop;
  var point = new TwoDee.Point(x, y);
  var start = this.draggableLink.start;
  this.draggableLink.setCoordinates(start, point);
};

/**
 * Ends dragging the link
 */
LinkableNode.prototype._endDragging = function () {
  var win = d3.select(window);
  win.on('mousemove.LinkableNode', null);
  win.on('mouseup.LinkableNode', null);
  this.draggableLink.hide();
};

/**
 * Responds to hovering over another linkable node
 */
LinkableNode.prototype._onHoverOtherNode = function () {
  var target = d3.event.target;
  var linkableNodeElem = this.findElemOfType(target, this._type);
  var elem = d3.select(linkableNodeElem);
  var id = elem.attr('data-id');

  // If hovering this node, do nothing
  if (id === this.id)
    return;
  
  // Prevent the regular drag listener from running  
  this._snap = true;

  // Add a listener to remove the snap when no longer hovering
  elem.on('mouseout.LinkableNode', this._onExitOtherNode.bind(this));

  // Snap the arrowhead to the other node
  var circle = elem.select('g.Node').select('circle');
  var x = circle.attr('cx');
  var y = circle.attr('cy');
  var r = circle.attr('r');
  var otherNodeCenter = new TwoDee.Point(x, y);
  var otherNodeCircle = new TwoDee.Circle(otherNodeCenter, r);
  var arrowStartPoint = this.draggableLink.start;
  var arrowLine = new TwoDee.Line.fromPoints(arrowStartPoint, otherNodeCenter);
  var intersectionPoints = arrowLine.intersectionWith(otherNodeCircle);
  var closestPoint = this.node.center.closest(intersectionPoints);
  var arrowStart = this.draggableLink.start;
  this.draggableLink.setCoordinates(arrowStart, closestPoint);
};

/**
 * Responds to exiting another linkable node
 */
LinkableNode.prototype._onExitOtherNode = function () {
  var target = d3.event.target;
  this._snap = false;
  d3.select(target).on('mouseout.LinkableNode', null);
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