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
      sequence:   this.props.sequence,
      structure:  this.props.structure,
      step:       'initialization'
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

  initializeViewport: function () {
    if (this.props.structure && this.props.sequence) {
      this.clearViewPort();
      _initialization = this.props.structure.initialization.operation;
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
    this.initializeViewport();
  },

  handleIncrementStep: function () {
    var state = this.state;
    var step;  // the operation and its data
    var op; // the function to execute
    if (state.step === state.sequence.operations.length - 1) return;
    if (state.step === 'initialization') {
      state.step = 0;
    } else {
      state.step += 1;
    }
    this.setState(state);
    step = state.sequence.operations[state.step];
    op = state.structure[step.type].operation;
    op(_viewport, step.data);
  },

  handleDecrementStep: function () {
    var state = this.state;
    var step = state.sequence.operations[state.step];
    var op;

    if (state.step === 'initialization') return;

    if (state.step === 0) {
      state.step = 'initialization';
    } else {
      state.step -= 1;
    }
    this.setState(state);
    op = state.structure[step.type].reverse;
    op();
  },

  handleKeyDown: function (e) {

    // left key press
    if (e.keyCode === 37) {
      this.handleDecrementStep();
    } 

    // right key press
    else if (e.keyCode === 39) {
      this.handleIncrementStep();
    }
  },

  /**
   * Initialize the component
   */
  componentDidMount: function () {
    var elem, width, height;
    var zoom;

    // add store listeners
    SequenceStore.addChangeListener(this.handleSequenceLoaded);

    // add left / right key listeners
    window.addEventListener('keydown', this.handleKeyDown);

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
    this.initializeViewport();

  },

  /**
   * Remove component listeners
   */
  componentWillUnmount: function () {
    SequenceStore.removeChangeListener(this.handleSequenceLoaded);
    window.removeEventListener('keydown', this.handleKeyDown);
  },

  /**
   * Render the component
   */
  render: function () {
    var structure   = this.state.structure;
    var steps       = this.state.sequence ? this.state.sequence.operations : [];
    var operations  = this.state.structure ? this.state.structure.operations : [];
    var cx = React.addons.classSet;

    var initializationClass = cx({
      'selected': this.state.step === 'initialization',
      'step':     true
    });

    var arrowLeftClass = cx({
      'arrow-left': true,
      'arrow':      true,
      'hide':       this.state.step === 'initialization'
    });

    var arrowRightClass = cx({
      'arrow-right':  true,
      'arrow':        true,
      'hide':         this.state.step === steps.length - 1
    });
    
    return (
      <div className="sequence-viewer">
        <h1>{this.props.sequence.name}</h1>
        <svg></svg>        
        <ul className="steps">
          <li className={initializationClass}>
            <div className="step-name">Initialization</div>
          </li>
          {steps.map(function (step, index) {
            var stepClass = cx({
              'selected': this.state.step === index,
              'step':     true
            });

            return (
              <li className={stepClass}>
                <div className="step-name">{structure[step.type].label}</div>
              </li>
            );
          }.bind(this))}
        </ul>
        <ul className="options">
          {this.props.options.map(function (option) {
            return (
              <li className="option" onClick={option.action}>{option.label}</li>
            );
          })}
        </ul>
        <div className={arrowLeftClass} onClick={this.handleDecrementStep}>
          <i className="fa fa-arrow-left" />
        </div>
        <div className={arrowRightClass} onClick={this.handleIncrementStep}>
          <i className="fa fa-arrow-right" />
        </div>
      </div>
    );
  }
});