var React           = require('react');
var SequenceStore   = require('../../../stores/SequenceStore');
var StructureStore  = require('../../../stores/StructureStore');

var drag;
var dragClass = 'draggable';
var viewport;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: {},
      structure: {}
    };
  },

  handleDragStart: function () {
    viewport.style('cursor', 'pointer');
  },

  handleDragEnd: function () {
    viewport.style('cursor', 'default');
  },

  handleDrag: function () {
    function getOffset (attr, axis) {
      var current = this.getAttribute(attr);
      if (current && axis === 'x') {
        return parseInt(current) + d3.event.dx;
      } else if (current && axis === 'y') {
        return parseInt(current) + d3.event.dy;
      } else {
        return current
      }
    }

    d3.event.sourceEvent.stopPropagation();
    viewport.selectAll('.' + dragClass)
      .attr('cx', function () {
        return getOffset.apply(this, ['cx', 'x']);
      })
      .attr('cy', function () {
        return getOffset.apply(this, ['cy', 'y']);
      })
      .attr('x1', function () {
        return getOffset.apply(this, ['x1', 'x']);
      })
      .attr('x2', function () {
        return getOffset.apply(this, ['x2', 'x']);
      })
      .attr('y1', function () {
        return getOffset.apply(this, ['y1', 'y']);
      })
      .attr('y2', function () {
        return getOffset.apply(this, ['y2', 'y']);
      })
      .attr('x', function () {
        return getOffset.apply(this, ['x', 'x']);
      })
      .attr('y', function () {
        return getOffset.apply(this, ['y', 'y']);
      });
  },

  handleSequenceLoaded: function () {
    var currentState = this.state;
    currentState.sequence = SequenceStore.getSequence();
    this.setState(currentState);
  },

  handleStructureLoaded: function () {
    var currentState = this.state;
    currentState.structure = StructureStore.getStructure();
    this.setState(currentState);
  },

  componentDidMount: function () {
    SequenceStore.addChangeListener(this.handleSequenceLoaded);
    StructureStore.addChangeListener(this.handleStructureLoaded);
    drag = d3.behavior.drag()
      .on('drag', this.handleDrag)
      .on('dragstart', this.handleDragStart)
      .on('dragend', this.handleDragEnd);
    viewport = d3.select('svg');
    viewport.call(drag);

    /* TMP */

    var width  = window.innerWidth;
    var height = window.innerHeight;
    var data   = [
      { id: 0, value: 0 },
      { id: 1, value: 1 },
      { id: 2, value: 2 },
      { id: 3, value: 3 }
    ];

    var node = viewport.selectAll('g')
      .data(data)
      .enter()
      .append('g');

    var circle = node.append('circle')
      .attr('class', dragClass)
      .attr('cx', function (d) { return (width / 2) + 100 * d.id; })
      .attr('cy', height / 2)
      .attr('r', '20');

    var label = node.append('text')
      .attr('class', dragClass)
      .attr('x', function (d) {
        return (width / 2) + 100 * d.id;
      })
      .attr('y', height / 2)
      .attr('fill', 'white')
      .text(function (d) {
        return d.value;
      });

    viewport.selectAll('line')
      .data(data.slice(0, data.length - 1))
      .enter()
      .append('line')
      .attr('class', dragClass)
      .attr('x1', function (d) {
        return (width / 2) + 100 * d.id;
      })
      .attr('x2', function (d) {
        return (width / 2) + 100 * (d.id + 1);
      })
      .attr('y1', height / 2)
      .attr('y2', height / 2)
      .style('stroke', 'black')
      .style('stroke-width', '2');
  },

  componentWillUnmount: function () {
    SequenceStore.removeChangeListener(this.handleSequenceLoaded);
    StructureStore.removeChangeListener(this.handleStructureLoaded);
  },

  render: function () {

    return (
      <div className="sequence-viewer">
        <h1>{this.state.sequence.name}</h1>
        <svg></svg>
      </div>
    );
  }
});