var React           = require('react');
var SequenceStore   = require('../../../stores/SequenceStore');
var SequenceActions = require('../../../actions/SequenceActions');

var dragClass = 'draggable';
var _viewport;
var _svg;
var _zoom;
var _numOperations; // used to see whether we need to increment the step when sequence is loaded

var _initialization;
var _operations = [];

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence:   this.props.sequence,
      structure:  this.props.structure,
      step:       'initialization',
      delete:     null
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
      this.props.reset();
    }
  },

  loadStep: function (step) {
    var i, op, stepObj, state;

    if (step === this.state.step) {
      return;
    }

    this.clearViewPort();
    this.initializeViewport();

    state = this.state;
    state.step = step;
    this.setState(state);

    if (step === 'initialization') {
      return;
    }

    for (var i = 0; i <= step; i += 1) {
      stepObj = this.state.sequence.operations[i];
      op = this.state.structure[stepObj.type].operation;
      op(_viewport, stepObj.data);
    }
  },

  handleIncrementStep: function () {
    var state = this.state;
    var step;  // the operation and its data
    var op; // the function to execute
    if (state.step === state.sequence.operations.length - 1) return;
    if (state.sequence.operations.length === 0) return;
    if (state.step === 'initialization') {
      state.step = 0;
    } else {
      state.step += 1;
    }
    this.props.onChangeStep(state.step);
    this.setState(state);
    step = state.sequence.operations[state.step];
    op = state.structure[step.type].operation;
    op(_viewport, step.data);
  },

  handleDecrementStep: function () {
    if (this.state.step === 'initialization') {
      return;
    }

    if (this.state.step === 0) {
      this.loadStep('initialization');
      return;
    }

    this.loadStep(this.state.step - 1);
  },

  /**
   * Loads the sequence into the state
   */
  handleSequenceLoaded: function () {
    var currentState = this.state;
    var currentOp;
    var nextOp;

    // get the current operation
    if (this.state.step !== 'initialization') {
      currentOp = this.state.sequence.operations[this.state.step];
    }

    currentState.sequence = SequenceStore.getSequence();
    this.setState(currentState);
    this.initializeViewport();

    // handle incrementing the step
    if (_numOperations !== undefined && _numOperations < currentState.sequence.operations.length) {
      this.handleIncrementStep();
    }
    _numOperations = currentState.sequence.operations.length;
  },

  handleCancelDelete: function () {
    var state = this.state;
    state.delete = null;
    this.setState(state);
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

    // escape key press
    else if (e.keyCode === 27) {
      if (this.state.delete !== null) {
        this.handleCancelDelete();
      } else if (this.state.step !== 'initialization') {
        this.handleDeleteStep(this.state.step);
      }
    }

    // enter key press
    else if (e.keyCode === 13) {
      if (this.state.delete !== null) {
        this.handleDeleteStep(this.state.delete);
      }
    }
  },

  handleDeleteStep: function (index) {
    var state = this.state;
    var sequence;
    if (state.delete === index) {
      sequence = state.sequence;
      sequence.operations.splice(index, 1);
      SequenceActions.update(sequence);
      state.delete = null;
      if (index <= this.state.step) {
        this.handleDecrementStep();
      }
    } else {
      state.delete = index;
    }
    this.setState(state);
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
      'hide':         this.state.step === steps.length - 1 || steps.length === 0
    });
    
    var deleteClass = cx({
      'delete-overlay': true,
      'hide':           this.state.delete === null
    }); 

    return (
      <div className="sequence-viewer">
        <h1>{this.props.sequence.name}</h1>
        <svg></svg>
        <div className={deleteClass}>
          Click delete button again or press enter to confirm step deletion.  Otherwise, press escape.
        </div>        
        <ul className="steps">
          <li className={initializationClass} onClick={this.loadStep.bind(this, "initialization")}>
            <div className="step-name">Initialization</div>
          </li>
          {steps.map(function (step, index) {
            var stepClass = cx({
              'selected': this.state.step === index,
              'step':     true
            });

            return (
              <li className={stepClass} onClick={this.loadStep.bind(this, index)}>
                <div className="delete-step" onClick={this.handleDeleteStep.bind(this, index)}>
                  <i className="fa fa-times" />
                </div>
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