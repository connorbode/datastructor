var uuid = require('node-uuid');

/**
 * All domain objects should implement
 * this class
 */
var DomainObject = function (type, container) {
  this._type = type;        // the type of the object; used for debugging.
  this.duration = 0;     // the duration of animations
  this.events = {};         // an object for tracking events
  this.eventIdCounter = 0;  // see addEventListener for more details
  this.id = uuid.v4();
  this.group = container.append('g')
    .attr('data-id', this.id)
    .classed(type, true);

  window.Datastructor.objects[this.id] = this;
};

if (!window.Datastructor) {
  window.Datastructor = {
    DomainObject: DomainObject,
    objects: {}
  };
}

/**
 * Sets an object's id
 */
DomainObject.prototype.setId = function (id) {
  window.Datastructor.objects[this.id] = undefined;
  this.id = id;
  this.group
    .attr('data-id', this.id);
  window.Datastructor.objects[this.id] = this;
};

/**
 * Set the duration for d3 transitions
 */
DomainObject.prototype.setTransitionDuration = function (duration) {
  this.duration = duration;
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

  if (!this.setCoordinates)
    throw "All domain objects must set the `setCoordinates` method! " + noComply;

  if (!this._addEvent)
    throw "All domain objects must set the `_addEvent` method! " + noComply;

  if (!this._removeEvent)
    throw "All domain objects must set the `_removeEvent` method! " + noComply;
};

/**
 * Hides the domain object
 */
DomainObject.prototype.hide = function () {

  this.checkInterface();
  return this.group
    .transition('showhide')
    .duration(this.duration)
    .attr('opacity', '0');
};

/**
 * Shows the domain object
 */
DomainObject.prototype.show = function () {

  this.checkInterface();
  return this.group
    .transition('showhide')
    .duration(this.duration)
    .attr('opacity', '1');
};

/**
 * Remove the domain object
 */
DomainObject.prototype.remove = function () {
  return this.group.remove();
};

/**
 * Send a domain object to the back of the group
 */
DomainObject.prototype.sendToBack = function () {
  var node = this.group.node();
  var parent = node.parentNode;
  var firstChild = parent.firstChild;
  if (firstChild) {
    node.remove();
    parent.insertBefore(node, firstChild);
  }
};

/** 
 * Given a DOM element, traverses up the DOM
 * tree until it finds an element of a given type.
 */
DomainObject.findElemOfType = function (elem, type) {
  do {
    if (elem.classList.contains(type)) {
      return elem;
    } else {
      elem = elem.parentNode;
    }
  } while (elem !== null);

  return null;
};

/**
 * Sets the coordinates of the object
 */
DomainObject.prototype.setCoordinates = function () {
  this.checkInterface();
};

/**
 * Adds event listener to the object.  The odd method of storing
 * callback references is because d3 only allows one
 * callback per event, but you can namespace events.
 * For example, the events 'click', and 'click.a' 
 * will both fire when on a click.
 */
DomainObject.prototype.addEventListener = function (event, callback) {
  this.checkInterface();

  // if the callback already exists, we increment that count.
  // there are instances where the same callback gets added
  // multiple times, and should be cancelled only when it is
  // removed as many times as it was added.
  var callbackIndex = this._findIndexOfEventListener(event, callback);
  if (callbackIndex > -1) {
    this.events[event][callbackIndex].count += 1;
  } 

  // if the callback doesn't exist, we need to create it.
  else {

    // namespace the event so we can add multiple listeners
    // for the same event
    var eventStr = event + '.' + this.eventIdCounter;
    this.eventIdCounter += 1;

    // add the event to the events object
    if (!this.events[event])
      this.events[event] = [];

    this.events[event].push({
      str:      eventStr,
      count:    1,
      callback: callback
    });

    // add the listeners to the d3 elements
    this._addEvent(event, eventStr, callback);
  }
};

/**
 * Finds the index of an event callback
 */
DomainObject.prototype._findIndexOfEventListener = function (event, callback) {
  if (!this.events[event])
    return -1;

  return this.events[event].reduce(function (sum, callbackObj, index) {
    if (callbackObj.callback == callback)
      sum = index;
    return sum;
  }, -1);
};


/**
 * Remove event listener from the object. See the description for 
 * addEventListener to understand the oddities in adding the event.
 */
DomainObject.prototype.removeEventListener = function (event, callback) {
  this.checkInterface();

  // retrieve the reference to the event
  var callbackIndex = this._findIndexOfEventListener(event, callback);
  if (callbackIndex === -1)
    return;

  var e = this.events[event][callbackIndex];

  // decrement the counter
  e.count -= 1;

  // remove the event if the counter is at 0
  if (e.count === 0) {
    console.log('removing', event);
    this._removeEvent(event, e.str, callback);
    this.events[event].splice(callbackIndex, 1);
  }
};

/**
 * Retrieves an object by ID
 */
DomainObject.getObject = function (id) {
  return window.Datastructor.objects[id];
};

/**
 * Generates an ID
 */
DomainObject.genId = function () {
  return uuid.v4();
};

module.exports = DomainObject;