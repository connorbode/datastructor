var React           = require('react/addons');
var SequenceStore   = require('../../../stores/SequenceStore');
var SequenceActions = require('../../../actions/SequenceActions');

var dragClass = 'draggable';
var _viewport;
var _svg;
var _zoom;
var _numOperations = 0; // used to see whether we need to increment the step when sequence is loaded

var _initialization;
var _operations = [];

var _stepsOffset = 0;

var _mouseCoordinates;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence:   this.props.sequence,
      structure:  this.props.structure,
      step:       'initialization',
      delete:     null,
      options:    null
    };
  },

  /**
   * Centers the elements on the screen
   */
  centerGroup: function () {
    var rect = _svg.node().getBoundingClientRect();
    var offsetLeft = rect.width / 2;
    var offsetTop = rect.height / 2;
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

    var steps = d3.selectAll('li.step')[0];
    var s;
    _stepsOffset = - steps[0].getBoundingClientRect().width / 2;

    if (step !== 'initialization') {
      for (var i = 0; i <= step; i += 1) {
        s = steps[i + 1];
        _stepsOffset -= s.getBoundingClientRect().width + 20;
        stepObj = this.state.sequence.operations[i];
        op = this.state.structure[stepObj.type].operation;
        op(_viewport, stepObj.data, 0);
      }
    }

    this.forceUpdate();
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

    _stepsOffset -= d3.select('li.step.selected').node().getBoundingClientRect().width + 20;
    this.forceUpdate();

    step = state.sequence.operations[state.step];
    op = state.structure[step.type].operation;
    op(_viewport, step.data, 1000);
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

    currentState.sequence = SequenceStore.getSequence();
    this.setState(currentState);

    if (!_initialization) {
      this.initializeViewport();
    }

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

  toggleOptions: function () {
    var state = this.state;
    if (state.options) {
      state.options = null;
    } else {
      state.options = _mouseCoordinates;
      document.getElementById('options').focus();
    }
    this.setState(state);
  },

  /**
   * Hides the options panel before triggering the
   * action
   */
  triggerAction: function (action) {
    this.toggleOptions();
    action();
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

    // space key press
    else if (e.keyCode === 32) {
      this.toggleOptions();
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

  handleMouseMove: function (e) {
    _mouseCoordinates = {
      x: e.clientX,
      y: e.clientY
    };
  },

  handleOptionsBlur: function (e) {
    if (this.state.options) {
      this.toggleOptions();
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
    window.addEventListener('mousemove', this.handleMouseMove);

    // add a resize listener to re-center
    window.addEventListener('resize', this.centerGroup);

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

    // set the step offset
    _stepsOffset = -d3.select('li.step').node().getBoundingClientRect().width / 2;

    // update the view
    this.initializeViewport();

  },

  /**
   * Remove component listeners
   */
  componentWillUnmount: function () {
    SequenceStore.removeChangeListener(this.handleSequenceLoaded);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
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

    var optionsClass = cx({
      'hide':     !this.state.options,
      'options':  true
    });

    var optionsStyle = {
      left: this.state.options ? this.state.options.x : 0,
      top:  this.state.options ? this.state.options.y : 0
    };

    var stepStyle = {
      transform: 'translateX(' + _stepsOffset + 'px)'
    };

    return (
      <div className="sequence-viewer">
        <h1>{this.props.sequence.name}</h1>
        <svg></svg>
        <div className={deleteClass}>
          Click delete button again or press enter to confirm step deletion.  Otherwise, press escape.
        </div>        
        <ul className="steps" style={stepStyle}>
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
        <ul id="options" onMouseLeave={this.handleOptionsBlur} className={optionsClass} style={optionsStyle}>
          {this.props.options.map(function (option) {
            return (
              <li className="option" onClick={this.triggerAction.bind(this, option.action)}>{option.label}</li>
            );
          }.bind(this))}
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