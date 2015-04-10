var React           = require('react/addons');
var SequenceEditor  = require('../SequenceEditor');
var SequenceViewer  = require('../SequenceViewer');
var SequenceActions = require('../../../actions/SequenceActions');

var _sequence;
var _arrays = [];

function updateSequence () {
  SequenceActions.update(_sequence);
};

var ArrayOperations = {
  initialization: function (viewport, data) {

    // add a blur event for the node adder
    d3.select('.edit-node-value')
      .on('blur', function (d) {
        d3.select(this)
          .classed('open', false);
      })
      .on('keydown', function (d) {
        if (d3.event.keyCode === 13) {
          d3.select(this)
            .classed('open', false);
        }
      });

    // add a blur event for the array adder
    function checkArraySize (obj) {
      var sequence;
      if (obj.value === '') {
        d3.select(obj)
          .classed('open', false)
          .classed('error', false);

      } else if (isNaN(parseInt(obj.value))) {
        d3.select(obj)
          .classed('error', true);

        obj.focus();
        obj.value = '';
      } else {
        d3.select(obj)
          .classed('open', false)
          .classed('error', false);

        _sequence.operations.push({
          data: parseInt(obj.value),
          type: 'createArray'
        });

        updateSequence();
      }
    }

    d3.select('.add-array-size')
      .on('blur', function (d) {
        checkArraySize(this);
      })
      .on('keydown', function (d) {
        if (d3.event.keyCode === 13) {
          checkArraySize(this);
        }
      });
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
  }
};

module.exports = React.createClass({

  addArray: function () {
    var elem = d3.select('.add-array-size')
      .classed('open', true)
      .style('top', window.innerHeight / 2)
      .style('left', window.innerWidth / 2);

    var node = elem.node();
    node.focus();
    node.value = '';
  },

  render: function () {
    var editorProps = {
      sequence:   this.props,
      structure:  ArrayOperations,
      options: [
        { label: '[ ]', action: this.addArray }
      ]
    };
    var viewerProps = {
      sequence:   this.props,
      structure:  ArrayOperations
    };
    _sequence = this.props;
    return (
      <div className="array-editor">
        <input className="edit-node-value value-input" placeholder="Update value" />
        <input className="add-array-size value-input" placeholder="Enter array size" />
        <SequenceEditor {...editorProps} />
        <SequenceViewer {...viewerProps} />
      </div>
    );
  }
});