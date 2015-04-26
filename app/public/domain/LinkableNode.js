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

  // dispatcher
  this.dispatcher = d3.dispatch('linkcreated', 'moved');

  // existing links
  this.links = {};
  this.linkedToBy = {};
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
  var x = d3.event.clientX - offsetLeft + this.node.center.x;
  var y = d3.event.clientY - offsetTop + this.node.center.y;
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
  var linkableNodeElem = DomainObject.findElemOfType(target, this._type);
  var elem = d3.select(linkableNodeElem);
  var id = elem.attr('data-id');

  // If hovering this node, do nothing
  if (id === this.id)
    return;
  
  // Prevent the regular drag listener from running  
  this._snap = true;

  // Add a listener to remove the snap when no longer hovering
  elem.on('mouseout.LinkableNode', this._onExitOtherNode.bind(this));

  // Add a listener to capture linking to the other node
  elem.on('mouseup.LinkableNode', this._onLinkOtherNode.bind(this));

  // Snap the arrowhead to the other node
  this._snapArrowheadToOtherNode(this.draggableLink, elem);
};

/**
 * Snaps the arrowhead to another node
 * `link` should be an instance of a Link
 * `other` should be a d3 selection of a LinkableNode DOM element
 */
LinkableNode.prototype._snapArrowheadToOtherNode = function (link, other) {

  var arrowStart = this.draggableLink.start;
  var arrowEnd;

  // get the details of the other node
  var circle = other.select('g.Node').select('circle').node();
  var x = parseFloat(circle.getAttribute('cx'));
  var y = parseFloat(circle.getAttribute('cy'));
  var r = parseFloat(circle.getAttribute('r'));

  // check if the arrowhead start is the same as the link
  if (arrowStart.x === x && arrowStart.y === y) {
    arrowEnd = arrowStart;
  }

  // otherwise, find the snap point
  else {
    var otherNodeCenter = new TwoDee.Point(x, y);
    var otherNodeCircle = new TwoDee.Circle(otherNodeCenter, r);
    var arrowStartPoint = this.draggableLink.start;
    var arrowLine = new TwoDee.Line.fromPoints(arrowStartPoint, otherNodeCenter);
    var intersectionPoints = arrowLine.intersectionWith(otherNodeCircle);
    arrowEnd = this.node.center.closest(intersectionPoints);
  }

  // set the link coordinates
  link.setCoordinates(arrowStart, arrowEnd);
};

/**
 * Responds to exiting another linkable node
 */
LinkableNode.prototype._onExitOtherNode = function () {
  var target = d3.event.target;
  this._snap = false;
  d3.select(target)
    .on('mouseout.LinkableNode', null)
    .on('mouseup.LinkableNode', null);
};

/**
 * Responds to the mouseup event on another linkable node
 */
LinkableNode.prototype._onLinkOtherNode = function () {
  var target = d3.event.target;
  var linkableNodeElem = DomainObject.findElemOfType(target, this._type);
  var otherId = d3.select(linkableNodeElem).attr('data-id');
  this._onExitOtherNode();
  this.dispatcher.linkcreated(this.id, otherId);
};

/** 
 * Sets the center of the node
 */
LinkableNode.prototype.setCoordinates = function (point) {
  var end = this.draggableLink.end;
  this.draggableLink.setCoordinates(point, end);
  this.node.setCoordinates(point);
  this.dispatcher.moved(point);
  
  // update each of the links
  var key;
  for (key in this.links) {
    var link = this.links[key];
    var end = link.end;
    link.setCoordinates(point, end);
  }

  // update each of the "linkedToBy" links
  for (key in this.linkedToBy) {
    var link = this.linkedToBy[key];
    var start = link.start;
    var nextCircle = new TwoDee.Circle(point, this.node.radius);
    console.log(point, start);
    var lineToNextCircle = TwoDee.Line.fromPoints(point, start);
    console.log(lineToNextCircle);
    var intersectionPoints = lineToNextCircle.intersectionWith(nextCircle);
    var closestPoint = start.closest(intersectionPoints);
    link.setCoordinates(start, closestPoint);
  }
};

/**
 * Sets the value of the node
 */
LinkableNode.prototype.setValue = function (value) {
  this.node.setValue(value);
};

/**
 * Adds an event listener; SHOULD NOT BE CALLED DIRECTLY
 */
LinkableNode.prototype._addEvent = function (event, eventStr, callback) {

  // add the events
  if (this.dispatcher[event]) {
    this.dispatcher.on(eventStr, callback);
  } 
  this.node._addEvent(event, eventStr, callback);
};

/**
 * Removes an event listener; SHOULD NOT BE CALLED DIRECTLY
 */
LinkableNode.prototype._removeEvent = function (event, eventStr, callback) {

  // remove the events
  if (this.dispatcher[event]) {
    this.dispatcher.on(eventStr, null);
  }
};

/**
 * Creates a link with another node.
 * - `other` should be an instance of a LinkableNode
 */
LinkableNode.prototype.createLink = function (other) {

  // check if link is bi-directional
  var bidirectional = false;
  if (other.links[this.id]) {
    if (this.allowBidirectional === false)
      return;

    bidirectional = true;
  }

  // console.log(other);

  // create the link
  var link = new Link(this.group);
  var start = this.node.center;
  var end = other.node.center;

  link.sendToBack();
  link.setCoordinates(start, end);
  this._snapArrowheadToOtherNode(link, other.group);

  // save the link
  this.links[other.id] = link;
  other.linkedToBy[this.id] = link;

  // register an event listeners to update the arrowhead
  // other.addEventListener('moved', this._updateLink.bind(this, other));
  // this.addEventListener('moved', this._updateLink.bind(this, other));
};

/**
 * Updates the head of a link
 * `other` should be an instance of a LinkableNode
 */
LinkableNode.prototype._updateLink = function (other) {
  var link = this.links[other.id];
  if (link) {
    var start = this.node.center;
    var end = link.end;
    this._snapArrowheadToOtherNode(link, other.group);
  }
}; 

/**
 * Removes a link
 */
LinkableNode.prototype.removeLink = function (other) {
  if (this.links[other.id]) {
    other.removeEventListener('moved', this._updateLink.bind(this, other));
    this.removeEventListener('moved', this._updateLink.bind(this, other));
    this.links[other.id].remove();
    this.links[other.id] = undefined;
  }
};

/**
 * Sets the transition duration
 */
LinkableNode.prototype.setTransitionDuration = function (duration) {
  this.node.setTransitionDuration(duration);
};

module.exports = LinkableNode;