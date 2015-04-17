var React           = require('react/addons');
var SequenceViewer  = require('../../partials/SequenceViewer');
var SequenceActions = require('../../../actions/SequenceActions');

var loners;     // these are nodes which are not part of lists
var lists;      // this is a list of linked lists.  links go forward in the lists
var _sequence;  // contains the sequence (passed through props)
var _editVal;   // contains details on teh node that is being edited

/** 
 * initializes the data for the editor
 */
function reset () {
  loners = [];
  lists = [];
  d3.select('g.loners').attr('transform', '');
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
       * Handler for entry of the edit node field
       */
      function editNode (elem) {
        var d3elem = d3.select(elem);
        if (d3elem.classed('open')) {
          d3elem.classed('open', false);
          _editVal.value = elem.value;
          addOperation({
            type: 'editValue', 
            data: _editVal
          });
          elem.value = '';
        }
      }

      /**
       * Handler for actions on the edit node field
       */
      d3.select('#edit-node-value')
        .on('blur', function () {
          editNode(this);
        })
        .on('keydown', function () {
          if (d3.event.keyCode === 13) {
            editNode(this);
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
      var horizontalOffset = 0;

      var group = lonersElem
        .append('g')
        .classed('node', true);

      loners.push(group);
      var index = loners.length - 1;

      group
        .append('circle')
        .attr('fill', '#ccc')
        .attr('cx', function (d, i) {
          return (index * 50) - horizontalOffset;
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
          return (index * 50) - horizontalOffset;
        })
        .attr('y', verticalOffset + 8)
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
          var elem = d3.select('#edit-node-value')
            .classed('open', true)
            .style('top', d3.event.clientY)
            .style('left', d3.event.clientX);

          _editVal = {
            list: 'loners',
            index: index
          };

          var node = elem.node();

          node.focus();
          node.value = '';
        });

      // center!
      var bbox = lonersElem.node().getBBox();
      lonersElem
        .transition()
        .duration(1000)
        .attr('transform', 'translate(' + (-bbox.width / 2) + ', 0)');
    }
  },

  editValue: {
    label: 'Edit Value',
    operation: function (viewport, data) {
      var group;
      if (data.list === 'loners') {
        group = d3.select('g.loners');
      } else {

      }

      var nodeGroup = group.selectAll('g.node')[0][data.index];
      d3.select(nodeGroup)
        .select('text')
        .text(data.value)
        .transition()
        .duration(1000)
        .attr('fill', '#000')
        .transition()
        .duration(1000)
        .attr('fill', '#aaa');
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
    reset();
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
        <input className="value-input" id="edit-node-value" placeholder="Edit node value" />
        <SequenceViewer {...viewerProps} />
      </div>
    );
  }
});