/**
 * All domain objects should implement
 * this class
 */
var DomainObject = function () {
  this.duration = 1000;
  this.group = null;
};

/**
 * Set the duration for d3 transitions
 */
DomainObject.prototype.setTransitionDuration = function (duration) {
  this.duration = 1000;
};

/**
 * Verifies that the domain object has set the
 * various required properties
 */
DomainObject.prototype.checkInterface = function () {
  if (!this._type)
    throw "All domain objects should set the `_type` property.  Otherwise, errors will be hard to trace.";

  var noComply = "The " + this._type + " class does not comply.";

  if (!this.group)
    throw "All domain objects must set the `group` property! " + noComply;

  if (!this.setXY)
    throw "All domain objects must set the `setXY` method! " + noComply;
};

/**
 * Hides the domain object
 */
DomainObject.prototype.hide = function () {

  this.checkInterface();
  this.group
    .transition('showhide')
    .duration(this.duration)
    .attr('opacity', '0');
};

/**
 * Shows the domain object
 */
DomainObject.prototype.show = function () {

  this.checkInterface();
  this.group
    .transition('showhide')
    .duration(this.duration)
    .attr('opacity', '1');
};

/**
 * Sets the coordinates of the group
 */
DomainObject.prototype.setXY = function (x, y) {
  this.checkInterface();
};

module.exports = DomainObject;