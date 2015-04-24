var React           = require('react/addons');
var SequenceViewer  = require('../../partials/SequenceViewer');
var SequenceActions = require('../../../actions/SequenceActions');
var TwoDee          = require('two-dee');

var loners;       // these are nodes which are not part of lists
var lists;        // this is a list of linked lists.  links go forward in the lists
var _sequence;    // contains the sequence (passed through props)
var _editVal;     // contains details on teh node that is being edited
var _dragging;    // whether the user is moving the mouse around
var _clickedNode; // the node that a user initiated an action on
var _mouseDown = false;
var _arrowSet = false;
var _startNode;
var _startNodeVal;
var _startPoint;
var _endNode;
var _endNodeVal;
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

/**
 * centers all the groups
 */
function centerGroups (duration) {

  // center!
  d3.selectAll('g.loners, g.list').each(function () {
    var elem = d3.select(this);
    var elems = elem.selectAll('g.node');
    var size = elems[0].length;
    var translateX = -((size - 1) * 100 + 4) / 2;
    var cIndex = 0;
    var tIndex = 0;
    elems
      .selectAll('circle')
      .each(function () {
        var circle = d3.select(this);
        circle
          .transition('center')
          .duration(duration)
          .attr('cx', cIndex * 100);
        cIndex += 1;
      });

    elems
      .selectAll('text')
      .each(function () {
        var text = d3.select(this);
        text
          .transition('center')
          .duration(duration)
          .attr('x', tIndex * 100);
        tIndex += 1;
      });

    elems
      .transition('center')
      .duration(duration)
      .attr('opacity', '1')
      .attr('transform', 'translate(' + translateX + ', 0)');
  });
}

var Operations = {
  initialization: {
    label: 'initialization',
    operation: function (viewport, data, transitionDuration) {

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
    operation: function (viewport, data, transitionDuration) {
      var lonersElem = viewport
        .select('g.loners');

      var verticalOffset = 0;
      var horizontalOffset = 0;

      var group = lonersElem
        .append('g');

      var index = loners.length;

      group
        .classed('node', true)
        .attr('opacity', '0')
        .attr('data-group', 'loners')
        .attr('data-index', index);

      loners.push(group);

      var node = group
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
        .on('mouseout', function (d) {
          d3.select(this)
            .attr('stroke-width', '0');
          _endNode = null;
        })
        .on('mouseup', function (d, i) {
          _mouseDown = false;
        })    
        .on('mouseover', function (d) {
          var node = d3.select(this.parentNode);
          var group = node.attr('data-group');
          var index = node.attr('data-index');
          d3.select(this)
            .attr('stroke-width', '2');
          _endNode = this.parentNode;
          _endNodeVal = {
            list: group,
            index: index
          };
        })
        .on('mousedown', function (d, i) {
          var node = d3.select(this.parentNode);
          var group = node.attr('data-group');
          var index = node.attr('data-index');
          d3.event.stopPropagation();
          _dragging = false;
          _mouseDown = true;
          _arrowSet = false;
          _startNode = this.parentNode;
          _startNodeVal = {
            list: group,
            index: index
          };
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
        .on('mouseout', function (d) {
          d3.select(this)
            .attr('fill', '#aaa');
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
        })    
        .on('mouseover', function (d) {
          var node = d3.select(this.parentNode);
          var group = node.attr('data-group');
          var index = node.attr('data-index');
          d3.select(this)
            .attr('fill', '#000');
          _endNode = this.parentNode;
          _endNodeVal = {
            list: group,
            index: index
          };
        })
        .on('mousedown', function (d, i) {
          var node = d3.select(this.parentNode);
          var group = node.attr('data-group');
          var index = node.attr('data-index');
          d3.event.stopPropagation();
          _dragging = false;
          _mouseDown = true;
          _arrowSet = false;
          _startNode = this.parentNode;
          _startNodeVal = {
            list: group,
            index: index
          };
        });
      
      centerGroups(transitionDuration);
    }
  },

  editValue: {
    label: 'Edit Value',
    operation: function (viewport, data, transitionDuration) {
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
        .duration(transitionDuration)
        .attr('fill', '#000')
        .transition()
        .duration(transitionDuration)
        .attr('fill', '#aaa');
    }
  },

  linkNodes: {
    label: 'Create Link',
    operation: function (viewport, data, transitionDuration) {
      var prev = data.prev;
      var next = data.next;
      var prevLength;
      var nodes = [];
      var nextLength;

      // populate lists
      if (prev.list === 'loners') {
        nodes.push(loners[prev.index]);
      } else {
        lists[prev.list].selectAll('g.node')[0].forEach(function (n, i) {
          if (i <= prev.index) {
            nodes.push(d3.select(n));
          }
        });
      }

      if (next.list === 'loners') {
        nodes.push(loners[next.index]);
      } else {
        lists[next.list].selectAll('g.node')[0].forEach(function (n, i) {
          if (i >= next.index) {
            nodes.push(d3.select(n));
          }
        });
      }

      // splice lists
      var splicePrev = prev.list === 'loners';
      var spliceNext = next.list === 'loners';
      if (splicePrev && spliceNext) {
        if (prev.index > next.index) {
          loners.splice(prev.index, 1);
          loners.splice(next.index, 1);
        } else {
          loners.splice(next.index, 1);
          loners.splice(prev.index, 1);
        }
      } else if (splicePrev) {
        loners.splice(prev.index, 1);
      } else if (spliceNext) {
        loners.splice(next.index, 1);
      }
      loners.forEach(function (l, i) {
        l.attr('data-index', i);
      });

      var group = viewport.append('g');
      var groupNum = lists.length;
      group.classed('list', 'true');
      lists.push(group);

      var verticalOffset = lists.length * 70;

      nodes.forEach(function (node, index) {
        var currentOffsetLeft = parseInt(node.select('circle').attr('cx'));
        var currentOffsetTop = node.select('circle').attr('cy');
        var translateLeft = - ((nodes.length - 1) * 100 + 40) / 2;
        var nextOffsetLeft = index * 100;
        var nextOffsetTop = verticalOffset;

        var translateX = nextOffsetLeft - currentOffsetLeft;
        var translateY = nextOffsetTop - currentOffsetTop;
        var transform = 'translate(' + translateX + ',' + translateY + ')';

        node
          .transition()
          .duration(transitionDuration)
          .attr('transform', transform)
          .attr('data-group', groupNum)
          .attr('data-index', index)
          .each('end', function () {

            var removed = node.remove();
            removed.attr('transform', '');
            removed.select('circle')
              .attr('cx', nextOffsetLeft)
              .attr('cy', nextOffsetTop);

            removed.select('text')
              .attr('x', nextOffsetLeft)
              .attr('y', nextOffsetTop + 8);

            if (index < nodes.length - 1) {

              var arrow = removed.select('g.arrow');
              var line = arrow.select('line');
              var polygon = arrow.select('polygon');

              if (arrow.empty()) {
                arrow = removed
                  .insert('g', ':first-child')
                  .classed('arrow', true);

                line = arrow
                  .append('line')
                  .style('opacity', '0');

                polygon = arrow
                  .append('polygon')
                  .style('opacity', '0');
              }

              line
                .attr('x1', nextOffsetLeft)
                .attr('y1', nextOffsetTop)
                .attr('x2', nextOffsetLeft + 72)
                .attr('y2', nextOffsetTop)
                .attr('stroke', '#555')
                .attr('stroke-width', '2')
                .transition()
                .duration(transitionDuration)
                .style('opacity', '1');

              var transformStr = 'translate(' + (nextOffsetLeft + 81) + ',' + nextOffsetTop + ')';

              polygon
                .attr('transform', transformStr)
                .attr('points', '0,0 -10,-10 -10,10')
                .style('color', '#555')
                .transition()
                .duration(transitionDuration)
                .style('opacity', '1');
            }

            group.append(function () {
              return removed.node();
            });

            centerGroups(transitionDuration);
          });
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
    reset();
  },

  onChangeStep: function () {

  },

  onMouseUp: function (e) {
    _mouseDown = false;
    if (_arrow) _arrow.remove();
    if (_endNode && _startNode != _endNode) {
      addOperation({
        type: 'linkNodes',
        data: {
          prev: _startNodeVal,
          next: _endNodeVal, 
        }
      });
    }
  },

  onMouseMove: function (e) {
    if (_mouseDown) {
      _dragging = true;

      if (!_arrowSet) {
        var circle = d3.select(_endNode).select('circle');
        var circleNode = circle.node();
        var startBox = circleNode.getBBox();
        var startRect = circleNode.getBoundingClientRect();
        var offsetLeft = (startBox.width / 2) + startRect.left;
        var offsetTop = (startBox.height / 2) + startRect.top;
        _startPoint = new TwoDee.Point(offsetLeft, offsetTop);

        _arrow = d3.select('svg')
          .insert('g', ':first-child')
          .classed('arrow', true);

        _arrow
          .append('line')
          .attr('x1', _startPoint.x)
          .attr('y1', _startPoint.y)
          .attr('x2', _startPoint.x)
          .attr('y2', _startPoint.y)
          .attr('stroke', '#555')
          .attr('stroke-width', '2');

        _arrow
          .append('polygon')
          .attr('points', '0,0 -10,10 10,10')
          .style('color', '#555')
          .style('opacity', '0');

        _arrowSet = true;
      }

      // update line
      var destX;
      var destY;
      var line = _arrow.select('line');

      if (_endNode) {
        var circle = d3.select(_endNode).select('circle');
        var circleNode = circle.node();
        var rect = circleNode.getBoundingClientRect();
        var centerX = rect.left + (rect.width / 2);
        var centerY = rect.top + (rect.height / 2);
        var radius = circle.attr('r');
        var circleCenter = new TwoDee.Point(centerX, centerY);
        var circleObj = new TwoDee.Circle(circleCenter, radius);
        var lineObj = new TwoDee.Line.fromPoints(circleCenter, _startPoint);
        var intersectionPoints = lineObj.intersectionWith(circleObj);
        var closestPoint = _startPoint.closest(intersectionPoints);
        destX = closestPoint.x;
        destY = closestPoint.y;
      } else {
        destX = e.clientX;
        destY = e.clientY;
      }

      if (!isNaN(destX)) {
        line
          .attr('x2', destX)
          .attr('y2', destY);

        // update arrow head 
        var polygonTranslate = 'translate(' + destX + ',' + destY + ')';
        var lineX = parseInt(line.attr('x1')) - parseInt(line.attr('x2'));
        var lineY = parseInt(line.attr('y1')) - parseInt(line.attr('y2'));
        var rotatorCuff = Math.atan2(-lineX, lineY);
        var rotatorCuffInDegrees = (180 * rotatorCuff) / Math.PI;
        var rotate = rotatorCuffInDegrees;
        var polygonRotate = 'rotate(' + rotate + ')';

        _arrow
          .select('polygon')
          .attr('transform', polygonTranslate + polygonRotate)
          .style('opacity', '1');
      }
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