var React           = require('react');
var SequenceStore   = require('../../../stores/SequenceStore');
var StructureStore  = require('../../../stores/StructureStore');

var drag;
var dragClass = 'draggable';
var svg;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: {},
      structure: {}
    };
  },

  handleDragStart: function () {
    svg.style('cursor', 'pointer');
  },

  handleDragEnd: function () {
    svg.style('cursor', 'default');
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
    svg.selectAll('circle.' + dragClass)
      .attr('cx', function () {
        return getOffset.apply(this, ['cx', 'x']);
      })
      .attr('cy', function () {
        return getOffset.apply(this, ['cy', 'y']);
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

  },

  componentDidUpdate: function () {
    var width  = window.innerWidth;
    var height = window.innerHeight;
    var data   = [
      { id: 0 },
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];

    svg = d3.select('svg');
    svg.call(drag);
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', dragClass)
      .attr('cx', function (d) { return (width / 2) + 50 * d.id; })
      .attr('cy', height / 2)
      .attr('r', '10');
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