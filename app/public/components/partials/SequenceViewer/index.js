var React           = require('react');
var SequenceStore   = require('../../../stores/SequenceStore');

var dragClass = 'draggable';
var _viewport;
var _svg;
var _zoom;

var _initialization;
var _operations = [];

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: {},
      structure: {}
    };
  },

  /**
   * Centers the elements on the screen
   */
  centerGroup: function () {
    var groupBbox = _viewport.node().getBBox();
    var groupWidth = groupBbox.width;
    var groupHeight = groupBbox.height;
    var containerNode = _svg.node();
    var containerWidth = containerNode.scrollWidth;
    var containerHeight = containerNode.scrollHeight;
    var offsetLeft = (containerWidth - groupWidth) / 2;
    var offsetTop = (containerHeight - groupHeight) / 2;
    _zoom.translate([offsetLeft, offsetTop]);
    _zoom.event(_svg);
  },

  /**
   * Handler for the zoom event.  
   * Pans and zooms the viewport.
   */
  handleZoom: function () {
    _viewport.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  },

  /**
   * Handles the zoomstart event.
   * Applies a pointer to the cursor so 
   * panning looks like the cursor responds.
   */
  handleZoomStart: function () {
    _svg.style('cursor', 'pointer');
  },

  /**
   * Handles the zoomend event.
   * Sets the cursor back to normal.
   */
  handleZoomEnd: function () {
    _svg.style('cursor', 'default');
  },

  clearViewPort: function () {
    _viewport.selectAll('*').remove();
  },

  updateOperations: function () {
    if (this.props.structure && this.props.sequence) {
      this.clearViewPort();
      _initialization = this.props.structure.initialization;
      _initialization(_viewport, this.props.sequence.data);
      this.forceUpdate();
      this.centerGroup();
    }
  },

  /**
   * Loads the sequence into the state
   */
  handleSequenceLoaded: function () {
    var currentState = this.state;
    currentState.sequence = SequenceStore.getSequence();
    this.setState(currentState);
    this.updateOperations();
  },

  /**
   * Initialize the component
   */
  componentDidMount: function () {
    var elem, width, height;
    var zoom;

    // add store listeners
    SequenceStore.addChangeListener(this.handleSequenceLoaded);

    // set up viewport
    _svg = d3.select('svg');
    _viewport = _svg.append('g');
    elem = _svg.node();
    width = elem.scrollWidth;
    height = elem.scrollHeight;

    // set up behaviors
    _zoom = d3.behavior.zoom()
      .center([width / 2, height / 2])
      .on('zoom', this.handleZoom)
      .on('zoomstart', this.handleZoomStart)
      .on('zoomend', this.handleZoomEnd);

    // apply behaviors
    _svg.call(_zoom);

    // update the view
    this.updateOperations();

  },

  /**
   * Remove component listeners
   */
  componentWillUnmount: function () {
    SequenceStore.removeChangeListener(this.handleSequenceLoaded);
  },

  /**
   * Render the component
   */
  render: function () {

    return (
      <div className="sequence-viewer">
        <h1>{this.props.sequence.name}</h1>
        <svg></svg>
      </div>
    );
  }
});