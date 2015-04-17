var React           = require('react/addons');
var SequenceViewer  = require('../../partials/SequenceViewer');
var SequenceActions = require('../../../actions/SequenceActions');

var loners;  // these are nodes which are not part of lists
var lists;   // this is a list of linked lists.  links go forward in the lists
var _sequence;

/** 
 * initializes the data for the editor
 */
function reset () {
  loners = [];
  lists = [];
}

/**
 * updates the sequence
 */
function updateSequence () {
  SequenceActions.update(_sequence);
}

/**
 * adds an operation to the sequence
 */
function addOperation (op) {
  _sequence.operations.push(op);
  updateSequence();
}

var Operations = {
  initialization: {
    label: 'initialization',
    operation: function (viewport, data) {

      reset();

      /**
       * Handler for entry of the initial value field
       */
      function createNode (elem) {
        var d3elem = d3.select(elem);
        if (d3elem.classed('open')) {
          d3elem.classed('open', false);
          addOperation({
            type: 'createNode',
            data: {
              value: elem.value
            }
          });
          elem.value = '';
        }
      }

      /**
       * Handler for actions on the initial value field
       */
      d3.select("#initial-value")
        .on('blur', function () {
          createNode(this);
        })
        .on('keydown', function () {
          if (d3.event.keyCode === 13) {
            createNode(this);
          }
        });

      /**
       * Append the loners group
       */
      viewport
        .append('g')
        .classed('loners', true);
    }
  },

  createNode: {
    label: 'Create Node',
    operation: function (viewport, data) {
      var lonersElem = viewport
        .select('g.loners');

      var verticalOffset = 0;
      var horizontalOffset = (loners.length + 1) * 50 / 2;

      var group = lonersElem
        .append('g')
        .classed('node', true);
              // add the background circle
      group
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
      group
        .append('text')
        .attr('fill', '#aaa')
        .style('font-size', '20px')
        .attr('x', function (d, i) {
          return ((i + 1) * 50) - horizontalOffset;
        })
        .attr('y', verticalOffset + 10)
        .attr('text-anchor', 'middle')
        .text(data.value || '_')
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

    }
  }
};

module.exports = React.createClass({

  addNode: function () {
    var elem = d3.select('#initial-value')
      .classed('open', true)
      .style('top', window.innerHeight / 2)
      .style('left', window.innerWidth / 2);

    var node = elem.node();
    node.focus();
    node.value = '';
  },

  reset: function () {

  },

  onChangeStep: function () {

  },

  render: function () {

    var viewerProps = {
      sequence:   this.props,
      structure:  Operations,
      options: [
        { label: '+', action: this.addNode }
      ],
      onChangeStep: this.onChangeStep,
      reset: this.reset
    };

    _sequence = this.props;

    return (
      <div className="singly-linked-list-editor">
        <input className="value-input" id="initial-value" placeholder="Enter initial node value" />
        <SequenceViewer {...viewerProps} />
      </div>
    );
  }
});