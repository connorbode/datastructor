var React           = require('react');
var SequenceStore   = require('../../../stores/SequenceStore');
var StructureStore  = require('../../../stores/StructureStore');

var drag;
var dragClass = 'draggable';
var _viewport;

var _initialization;
var _operations = [];

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: {},
      structure: {}
    };
  },

  handleDragStart: function () {
    _viewport.style('cursor', 'pointer');
  },

  handleDragEnd: function () {
    _viewport.style('cursor', 'default');
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
    _viewport.selectAll('.' + dragClass)
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
    _initialization = new Function("params", "data", currentState.structure.initialization);
    _initialization({
      viewport:   _viewport,
      dragClass:  dragClass
    });
    this.setState(currentState);
  },

  componentDidMount: function () {
    SequenceStore.addChangeListener(this.handleSequenceLoaded);
    StructureStore.addChangeListener(this.handleStructureLoaded);
    drag = d3.behavior.drag()
      .on('drag', this.handleDrag)
      .on('dragstart', this.handleDragStart)
      .on('dragend', this.handleDragEnd);
    _viewport = d3.select('svg');
    _viewport.call(drag);

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