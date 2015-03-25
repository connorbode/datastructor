var React           = require('react');
var SequenceStore   = require('../../../stores/SequenceStore');
var StructureStore  = require('../../../stores/StructureStore');

var dragClass = 'draggable';
var _viewport;
var _svg;

var _initialization;
var _operations = [];

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: {},
      structure: {}
    };
  },

  handleZoom: function () {
    _viewport.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  },

  handleZoomStart: function () {
    _svg.style('cursor', 'pointer');
  },

  handleZoomEnd: function () {
    _svg.style('cursor', 'default');
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
    var elem, width, height;
    var zoom;

    // add store listeners
    SequenceStore.addChangeListener(this.handleSequenceLoaded);
    StructureStore.addChangeListener(this.handleStructureLoaded);

    // set up viewport
    _svg = d3.select('svg');
    _viewport = _svg.append('g');
    elem = _svg.node();
    width = elem.scrollWidth;
    height = elem.scrollHeight;

    // set up behaviors
    zoom = d3.behavior.zoom()
      .center([width / 2, height / 2])
      .on('zoom', this.handleZoom)
      .on('zoomstart', this.handleZoomStart)
      .on('zoomend', this.handleZoomEnd);

    // apply behaviors
    _svg.call(zoom);
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