var React           = require('react/addons');
var SequenceViewer  = require('../../partials/SequenceViewer');
var SequenceActions = require('../../../actions/SequenceActions');

var _step = 'initialization'; // the step that the viewer is on
var _sequence;
var _editVal = {
  group: null,
  index: null
};
var _groups = [];

function updateSequence () {
  SequenceActions.update(_sequence);
};

function addOperation (op) {
  _sequence.operations.push(op);
  updateSequence();
}

var ArrayOperations = {
  initialization: {
    label: 'Initialization',
    operation: function (viewport, data) {

      function editNodeValue (val) {
        if (val !== '') {
          addOperation({
            type: 'editValue',
            data: {
              group: _editVal.group,
              index: _editVal.index,
              value: val
            }
          });
        }
      }

      // add a blur event for the node adder
      d3.select('.edit-node-value')
        .on('blur', function (d) {
          d3.select(this)
            .classed('open', false);

          editNodeValue(this.value);
          this.value = '';
        })
        .on('keydown', function (d) {
          if (d3.event.keyCode === 13) {
            d3.select(this)
              .classed('open', false);
            editNodeValue(this.value);
            this.value = '';
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

          addOperation({
            data: parseInt(obj.value),
            type: 'createArray'
          });

          obj.value = '';
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
    }
  }, 

  createArray: {
    label: 'Create Array',
    operation: function (viewport, data) {

      // initialize empty array
      var i = 0;
      var array = [];
      for (i; i < data; i += 1) {
        array.push({ value: null });
      }

      var verticalOffset = (_groups.length - 1) * 50;
      var horizontalOffset = (array.length + 1) * 50 / 2;

      // add the groups for each node
      var group = viewport
        .append('g')
        .classed('array', true);

      _groups.push(group);

      var nodes = group
        .selectAll('g')
        .data(array)
        .enter()
        .append('g')
        .classed('node', true);

      // add the background circle
      nodes
        .append('circle')
        .attr('fill', '#ccc')
        .attr('cx', function (d, i) {
          return ((i + 1) * 50) - horizontalOffset;
        })
        .attr('cy', verticalOffset)
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
          return ((i + 1) * 50) - horizontalOffset;
        })
        .attr('y', verticalOffset + 10)
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
        .on('click', function (d, i) {
          var elem = d3.select('.edit-node-value')
            .classed('open', true)
            .style('top', d3.event.clientY)
            .style('left', d3.event.clientX);

          var node = elem.node();
          _editVal.group = _groups.length - 1;
          _editVal.index = i;

          node.focus();
          node.value = '';
        });

      // add opening bracket
      group
        .append('text')
        .attr('fill', 'black')
        .attr('x', - horizontalOffset)
        .attr('y', verticalOffset + 12)
        .style('font-size', '40px')
        .text('[');

      // add closing bracket
      group
        .append('text')
        .attr('fill', 'black')
        .attr('y', verticalOffset + 12)
        .attr('x', ((array.length + 1) * 50) - 10 - horizontalOffset)
        .style('font-size', '40px')
        .text(']');
    },
    reverse: function (viewport) {
      var lastIndex = _groups.length - 1;
      d3.selectAll(_groups[lastIndex])[0]
        .remove();
      _groups.pop();
    }
  },

  editValue: {

    label: 'Edit Value',
    operation: function (viewport, data) {
      var arr = d3.selectAll('g.array')[0][data.group];
      var node = d3.select(arr).selectAll('g.node')[0][data.index];
      d3.select(node).selectAll('text')[0][0].innerHTML = data.value;
    },

    reverse: function (viewport, data) {

    }
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

  onChangeStep: function (step) {
    _step = step;
  },

  reset: function () {
    _groups = [];
  },

  render: function () {
    var viewerProps = {
      sequence:   this.props,
      structure:  ArrayOperations,
      options: [
        { label: '[ ]', action: this.addArray }
      ],
      onChangeStep: this.onChangeStep,
      reset: this.reset
    };
    _sequence = this.props;
    return (
      <div className="array-editor">
        <input className="edit-node-value value-input" placeholder="Update value" />
        <input className="add-array-size value-input" placeholder="Enter array size" />
        <SequenceViewer {...viewerProps} />
      </div>
    );
  }
});