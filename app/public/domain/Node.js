var DomainObject = require('./DomainObject');
var TwoDee       = require('two-dee');

/**
 * It is expected that container is a d3
 * object, where the node will be appended.
 */
var Node = function (container) {

  // call the parent constructor
  DomainObject.call(this, 'Node', container);

  // set defaults
  this.radius = 20;
  this.center = new TwoDee.Point(0,0);

  // append the circle
  this.circle = this.group
    .append('circle')
    .attr('fill', '#ccc')
    .attr('r', this.radius)
    .attr('stroke', '#aaa')
    .attr('stroke-width', '0')
    .attr('cx', '0')
    .attr('cy', '0')
    .style('cursor', 'pointer');

  // append the text
  this.text = this.group
    .append('text')
    .attr('fill', '#aaa')
    .attr('text-anchor', 'middle')
    .attr('x', '0')
    .attr('y', '8')
    .style('font-size', '20px')
    .style('cursor', 'pointer'); 

  this.setValue('_');

  // add event listeners to circle
  this.circle
    .on('mouseover', function () {
      d3.select(this)
        .attr('stroke-width', '2');
    })
    .on('mouseout', function () {
      d3.select(this)
        .attr('stroke-width', '0');
    });

  // add event listeners to text
  this.text
    .on('mouseover', function () {
      d3.select(this)
        .attr('fill', '#000');
    })
    .on('mouseout', function () {
      d3.select(this)
        .attr('fill', '#aaa');
    })
    .on('click', function () {
      this._openEditor(d3.event.clientX, d3.event.clientY);
    }.bind(this));

  // add a dispatcher for valuechanged event
  this.dispatcher = d3.dispatch('valuechanged');
};

// Inherit from Domain Object
Node.prototype = Object.create(DomainObject.prototype);
Node.prototype.constructor = Node;

/**
 * Sets the coordinates of the node
 */
Node.prototype.setCoordinates = function (point) {

  this.center = point;

  this.circle
    .transition()
    .duration(this.duration)
    .attr('cx', point.x)
    .attr('cy', point.y);

  this.text
    .transition()
    .duration(this.duration)
    .attr('x', point.x)
    .attr('y', point.y + 8);
};

/**
 * Sets the value of the node
 */
Node.prototype.setValue = function (value) {

  this.value = value;
  this.text
    .text(function () {
      return value;
    });
};

/** 
 * Adds an event listener.  This method should never
 * be called directly.
 */
Node.prototype._addEvent = function (event, eventStr, callback) {

  // register the callbacks
  this.circle.on(eventStr, callback);
  this.text.on(eventStr, callback);
  if (this.dispatcher[event]) {
    this.dispatcher.on(eventStr, callback);
  }
};

/**
 * Removes an event listener.  This method should never
 * be called directly.
 */
Node.prototype._removeEvent = function (event, eventStr, callback) {

  // delete the callbacks
  this.circle.on(eventStr, null);
  this.text.on(eventStr, null);
  if (this.dispatcher[event]) {
    this.dispatcher.on(eventStr, callback);
  }
};

/**
 * Displays the edit node value input
 */
Node.prototype._openEditor = function (left, top) {

  this.editor = d3.select('body')
    .append('input');

  this.editor
    .classed('value-input', true)
    .classed('open', true)
    .attr('placeholder', 'Update value')
    .style('top', top)
    .style('left', left)
    .on('keydown', function () {
      if (d3.event.keyCode === 13) {
        this._getEditorValue();
        this._closeEditor();
      }
    }.bind(this))
    .on('blur', this._closeEditor.bind(this))
    .on('mousedown', function () {
      d3.event.stopPropagation();
    });

  var elem = this.editor.node();
  elem.focus();
  elem.value = '';
};

/**
 * Closes the edit node input
 */
Node.prototype._closeEditor = function () {
  if (this.editor) {
    this.editor.on('blur', null);
    this.editor.remove();
    this.editor = undefined;
  }
};

/**
 * Retrieves the value of the editor
 */
Node.prototype._getEditorValue = function () {
  if (this.editor) {
    var value = this.editor.node().value;
    this.dispatcher.valuechanged(value);
  }
};

module.exports = Node;