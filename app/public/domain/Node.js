var DomainObject = require('./DomainObject');

/**
 * It is expected that container is a d3
 * object, where the node will be appended.
 */
var Node = function (container) {

  // a type reference
  this._type = 'Node';

  // initialize the group element
  this.group = container.append('g');
  this.group 
    .classed('node', true);

  // append the circle
  this.circle = this.group
    .append('circle')
    .attr('fill', '#ccc')
    .attr('r', '20')
    .attr('stroke', '#aaa')
    .attr('stroke-width', '0')
    .style('cursor', 'pointer');

  // append the text
  this.text = this.group
    .append('text')
    .attr('fill', '#aaa')
    .attr('text-anchor', 'middle')
    .style('font-size', '20px')
    .style('cursor', 'pointer');

  // set defaults
  this.setXY(0, 0);
  this.setValue('_');
};

// Inherit from Domain Object
Node.prototype = new DomainObject();
Node.prototype.constructor = Node;

/**
 * Sets the coordinates of the node
 */
Node.prototype.setXY = function (x, y) {

  this.x = x;
  this.y = y;

  this.circle
    .attr('cx', x)
    .attr('cy', y);

  this.text
    .attr('x', x)
    .attr('y', y + 8);
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

module.exports = Node;