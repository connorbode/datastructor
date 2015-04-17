var React           = require('react/addons');
var SequenceViewer  = require('../../partials/SequenceViewer');
var SequenceActions = require('../../../actions/SequenceActions');

var loners;       // these are nodes which are not part of lists
var lists;        // this is a list of linked lists.  links go forward in the lists
var _sequence;    // contains the sequence (passed through props)
var _editVal;     // contains details on teh node that is being edited
var _dragging;    // whether the user is moving the mouse around
var _clickedNode; // the node that a user initiated an action on
var _mouseDown = false;
var _arrowSet = false;
var _startNode;
var _arrow;

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
        .append('g');

      group
        .classed('node', true)
        .attr('opacity', '0')
        .transition()
        .duration(1000)
        .attr('opacity', '1');

      loners.push(group);
      var index = loners.length - 1;

      group
        .append('circle')
        .attr('fill', '#ccc')
        .attr('cx', function (d, i) {
          return (index * 100) - horizontalOffset;
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
        })
        .on('mousedown', function (d, i) {
          d3.event.stopPropagation();
          _dragging = false;
          _mouseDown = true;
          _arrowSet = false;
          _startNode = d3.select(this).node();
        })
        .on('mouseup', function (d, i) {
          _mouseDown = false;
        });

      // add the value of the node
      group
        .append('text')
        .attr('fill', '#aaa')
        .style('font-size', '20px')
        .attr('x', function (d, i) {
          return (index * 100) - horizontalOffset;
        })
        .attr('y', verticalOffset + 8)
        .attr('text-anchor', 'middle')
        .text(function () {
          return data.value || '_';
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
        .on('mousedown', function (d, i) {
          d3.event.stopPropagation();
          _dragging = false;
          _mouseDown = true;
          _arrowSet = false;
          _startNode = d3.select(this).node();
        })
        .on('mouseup', function (d) {
          _mouseDown = false;
          if (!_dragging) {
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
          }
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
        .text(data.value || '_')
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

  onMouseUp: function (e) {
    _mouseDown = false;
  },

  onMouseMove: function (e) {
    if (_mouseDown) {
      _dragging = true;
      console.log('dragging..');
      if (!_arrowSet) {
        var startBox = _startNode.getBBox();
        var startRect = _startNode.getBoundingClientRect();
        _arrow = d3.select('svg')
          .append('g')
          .classed('arrow', true);

        _arrow
          .append('line')
          .attr('x1', (startBox.width / 2) + startRect.left)
          .attr('y1', (startBox.height / 2) + startRect.top)
          .attr('stroke', '#000')
          .attr('stroke-width', '2');

        _arrow
          .append('polygon')
          .attr('points', '0,-2 -10,10 10,10');

        _arrowSet = true;
      }

      // update line
      var line = _arrow.select('line');
      line
        .attr('x2', e.clientX)
        .attr('y2', e.clientY);

      // update arrow head 
      var polygonTranslate = 'translate(' + e.clientX + ',' + e.clientY + ')';
      var lineX = parseInt(line.attr('x1')) - parseInt(line.attr('x2'));
      var lineY = parseInt(line.attr('y1')) - parseInt(line.attr('y2'));
      var rotatorCuff = Math.atan2(-lineX, lineY);
      var rotatorCuffInDegrees = (180 * rotatorCuff) / Math.PI;
      var rotate = rotatorCuffInDegrees;
      var polygonRotate = 'rotate(' + rotate + ')';

      console.log('lineX: ', lineX, ' lineY: ', lineY, ' angle: ', rotatorCuffInDegrees, ' orig: ', rotatorCuff);

      _arrow
        .select('polygon')
        .attr('transform', polygonTranslate + polygonRotate);
    }
  },

  componentDidMount: function () {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  },

  componentWillUnmount: function () {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
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