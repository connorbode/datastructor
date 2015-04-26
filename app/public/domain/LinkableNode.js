var DomainObject  = require('./DomainObject');
var Node          = require('./Node');
var Link          = require('./Link');
var TwoDee        = require('two-dee');
var Promise       = require('es6-promise').Promise;

var LinkableNode = function (container) {

  // call the parent constructor
  DomainObject.call(this, 'LinkableNode', container);

  // append the draggable link
  this.draggableLink = null;
  // new Link(this.group);
  // this.draggableLink.setTransitionDuration(0);
  // this.draggableLink.hide();

  // event dispatcher
  this.dispatcher = d3.dispatch('linkcreated', 'moved', 'valuechanged');

  // append a node
  this.node = new Node(this.group);
  this.node.addEventListener('mousedown', this._startDragging.bind(this));
  this.node.addEventListener('valuechanged', this._emitValueChanged.bind(this));

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
  this.draggableLink = new Link(this.group);
  this.draggableLink.setTransitionDuration(0);
  this.draggableLink.sendToBack();
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
  var start = this.node.center;
  this.draggableLink.setCoordinates(start, point);
};

/**
 * Ends dragging the link
 */
LinkableNode.prototype._endDragging = function () {
  var win = d3.select(window);
  win.on('mousemove.LinkableNode', null);
  win.on('mouseup.LinkableNode', null);
  this.draggableLink.remove();
  this.draggableLink = null;
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
  var other = DomainObject.getObject(id);
  var snapPoint = LinkableNode._getSnapPoint(this, other);
  this.draggableLink.setCoordinates(this.node.center, snapPoint);
};

/**
 * Given two nodes, one that is linking to another, this
 * method returns the "snap point", the first point of 
 * intersection with the other node.
 * - `first` the linking node; should be a LinkableNode
 * - `second` the linked node; should be a LinkableNode
 */
LinkableNode._getSnapPoint = function (first, second) {

  // the return point
  var snapPoint;

  // check if the have the same center
  if (first.node.center.x === second.node.center.x && first.node.center.y === second.node.center.y) {
    snapPoint = first.node.center;
  }

  // otherwise, find the snap point
  else {
    var line = TwoDee.Line.fromPoints(first.node.center, second.node.center);
    var circle = new TwoDee.Circle(second.node.center, second.node.radius);
    var intersectionPoints = line.intersectionWith(circle);
    snapPoint = first.node.center.closest(intersectionPoints);
  }

  return snapPoint;
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
  var promise = this.node.setCoordinates(point);
  this.dispatcher.moved(point);
  
  // update each of the links
  var key;
  for (key in this.links) {
    var link = this.links[key].link;
    var end = LinkableNode._getSnapPoint(this, this.links[key].node);
    link.setCoordinates(point, end);
  }

  // update each of the "linkedToBy" links
  for (key in this.linkedToBy) {
    var link = this.linkedToBy[key].link;
    var start = link.start;
    var end = LinkableNode._getSnapPoint(this.linkedToBy[key].node, this);
    link.setCoordinates(start, end);
  }

  return promise;
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

  // create the link
  var link = new Link(this.group);
  var start = this.node.center;
  var end = LinkableNode._getSnapPoint(this, other);

  return new Promise(function (resolve) {
    link.sendToBack();
    var transition = link.setCoordinates(start, end);

    // save the links
    this.links[other.id] = {
      link: link,
      node: other
    };

    other.linkedToBy[this.id] = {
      link: link,
      node: this
    };

    // resolve the promise when the transition finishes
    transition.each('end', function () {
      link.setTransitionDuration(this.duration / 2);
      link.show().then(function () {
        resolve();
      });
    });
  }.bind(this));
};

/**
 * Updates the head of a link
 * `other` should be an instance of a LinkableNode
 */
LinkableNode.prototype._updateLink = function (other) {
  var link = this.links[other.id].link;
  if (link) {
    var start = this.node.center;
    var end = link.end;
    var snapPoint = LinkableNode._getSnapPoint(this, other);
    link.setCoordinates(start, snapPoint);
  }
}; 

/**
 * Removes a link
 */
LinkableNode.prototype.removeLink = function (other) {
  if (this.links[other.id]) {
    other.removeEventListener('moved', this._updateLink.bind(this, other));
    this.removeEventListener('moved', this._updateLink.bind(this, other));
    this.links[other.id].link.remove();
    this.links[other.id] = undefined;
  }
};

/**
 * Sets the transition duration
 */
LinkableNode.prototype.setTransitionDuration = function (duration) {
  var key;
  this.duration = duration;
  this.node.setTransitionDuration(duration);
  for (key in this.links) {
    this.links[key].link.setTransitionDuration(duration);
  }
};

/**
 * Echos the value changed event from the Node
 */
LinkableNode.prototype._emitValueChanged = function (id, value) {
  this.dispatcher.valuechanged(this.id, value);
};

module.exports = LinkableNode;