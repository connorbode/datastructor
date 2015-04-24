var DomainObject  = require('./DomainObject');
var TwoDee        = require('two-dee');

var Link = function (container) {

  // call the parent constructor
  DomainObject.call(this, 'Link', container);

  // append the line
  this.line = this.group
    .append('line')
    .attr('stroke', '#555')
    .attr('stroke-width', '2');

  // append the arrow head
  this.polygon = this.group
    .append('polygon')
    .attr('points', '0,0 -10,10 10,10')
    .style('color', '#555');

  this.start = new TwoDee.Point(0,0);
  this.end = new TwoDee.Point(0,0);
};

// inherit from DomainObject
Link.prototype = Object.create(DomainObject.prototype);
Link.prototype.constructor = Link;

/**
 * Draws the coordinates of the link
 */
Link.prototype.setCoordinates = function (start, end) {
  
  // save the points
  this.start = start;
  this.end = end;

  // set the points for the line
  this.line
    .attr('x1', start.x)
    .attr('y1', start.y)
    .attr('x2', end.x)
    .attr('y2', end.y);

  // get the appropriate rotation for the arrowhead
  var dx = start.x - end.x;
  var dy = start.y - end.y;
  var rotationInRadians = Math.atan2(-dx, dy);
  var rotationInDegrees = (180 * rotationInRadians) / Math.PI;

  // get the appropriate translation for the arrowhead
  var translateX = end.x;
  var translateY = end.y;

  // build the transform string for the arrow head
  var rotationStr = 'rotate(' + rotationInDegrees + ')';
  var translationStr = 'translate(' + translateX + ',' + translateY + ')';
  var transformStr = translationStr + rotationStr;

  // set the arrow heads coordinates
  this.polygon
    .attr('transform', transformStr);
};

/**
 * Adds an event; should not be called directly
 */
Link.prototype._addEvent = function (event, eventStr, callback) {

  // add the event
  this.line.on(eventStr, callback);
  this.polygon.on(eventStr, callback);
};

/**
 * Removes an event; should not be called directly
 */
Link.prototype._removeEvent = function (event, eventStr, callback) {

  // remove the event
  this.line.on(eventStr, null);
  this.line.on(eventStr, null);
};

module.exports = Link;