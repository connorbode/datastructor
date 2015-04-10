var React          = require('react/addons');
var SequenceEditor = require('../SequenceEditor');

var _sequence;
var _array = [];

function updateSequence () {

};

var ArrayOperations = {
  initialization: function (viewport, data) {

  },

  createArray: function (viewport, data) {

    // initialize empty array
    var i = 0;
    _array = [];
    for (i; i < data; i += 1) {
      _array.push({ value: null });
    }

    // add the groups for each node
    var nodes = viewport
      .selectAll('g')
      .data(_array)
      .enter()
      .append('g');

    // add the background circle
    nodes
      .append('circle')
      .attr('fill', '#ccc')
      .attr('cx', function (d, i) {
        return (i + 1) * 50;
      })
      .attr('r', '20')
      .attr('stroke', '#aaa')
      .attr('stroke-width', '0')
      .style('cursor', 'pointer')
      .on('mouseover', function (d) {
        d3.select(this)
          .attr('stroke-width', '2');
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .attr('stroke-width', '0');
      });

    // add the value of the node
    nodes
      .append('text')
      .attr('fill', '#aaa')
      .style('font-size', '20px')
      .attr('x', function (d, i) {
        return ((i + 1) * 50);
      })
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .text(function (d) {
        return (d.value || '_');
      })
      .style('cursor', 'pointer')
      .on('mouseover', function (d) {
        d3.select(this)
          .attr('fill', 'black');
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .attr('fill', '#aaa');
      })
      .on('click', function (d) {
        var elem = d3.select('.edit-node-value')
          .classed('open', true)
          .style('top', d3.event.clientY)
          .style('left', d3.event.clientX);

        var node = elem.node();

        node.focus();
        node.value = '';
      });

    // add opening bracket
    viewport
      .append('text')
      .attr('fill', 'black')
      .attr('y', '12')
      .style('font-size', '40px')
      .text('[');

    // add closing bracket
    viewport
      .append('text')
      .attr('fill', 'black')
      .attr('y', '12')
      .attr('x', ((_array.length + 1) * 50) - 10)
      .style('font-size', '40px')
      .text(']');

    // add a blur event for the node editor
    d3.select('.edit-node-value')
      .on('blur', function (d) {
        d3.select(this)
          .classed('open', false);
      })
      .on('keydown', function (d) {
        if (d3.event.keyCode === 13) {
          d3.select(this).classed('open', false);
        }
      });
  }
};

module.exports = React.createClass({

  render: function () {
    var props = {
      sequence:   this.props,
      structure:  ArrayOperations
    };
    return (
      <div className="array-editor">
        <input className="edit-node-value" placeholder="Update value" />
        <SequenceEditor {...props} />
      </div>
    );
  }
});