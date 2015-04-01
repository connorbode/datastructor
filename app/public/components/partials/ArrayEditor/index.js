var React          = require('react/addons');
var SequenceEditor = require('../SequenceEditor');

var _sequence;
var _array = [];

var ArrayOperations = {
  initialization: {
    validation: {
      type:   'integer',
      label:  'initial array size'
    },

    operation: function (viewport, data) {

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
        .attr('r', '20');

      // add the value of the node
      nodes
        .append('text')
        .attr('fill', function (d) {
          return d.value === null
            ? '#aaa'
            : 'black';
        })
        .style('font-size', '20px')
        .attr('x', function (d, i) {
          return ((i + 1) * 50);
        })
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .text(function (d) {
          return (d.value || '_');
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
    }
  }
};

module.exports = React.createClass({

  render: function () {
    var props = {
      sequence:   this.props,
      structure:  ArrayOperations
    };
    return (
      <div>
        <SequenceEditor {...props} />
      </div>
    );
  }
});