var React             = require('react');
var SequenceStore     = require('../../../stores/SequenceStore');
var DataInput         = require('../DataInput');
var SequenceActions   = require('../../../actions/SequenceActions');

var INITIALIZATION_STEP_NAME  = 'Initialization';
var ADD_STEP_NAME             = 'Add Step';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: null,
      structure: null,
      step: null
    };
  },

  addStep: function () {
    var state = this.state;
    state.step = ADD_STEP_NAME;
    this.setState(state);
  },

  loadInitializationStep: function () {
    var state = this.state;
    state.step = INITIALIZATION_STEP_NAME;
    this.setState(state);
  },

  handleInitializationDataChange: function (data) {
    var state = this.state;
    state.sequence.data = data;
    this.setState(state);
    SequenceActions.update(state.sequence);
  },

  handleSequenceChange: function () {
    var state = this.state;
    state.sequence = SequenceStore.getSequence();
    this.setState(state);
  },

  componentDidMount: function () {
    SequenceStore.addChangeListener(this.handleSequenceChange);
  },

  componentWillUnmount: function () {
    SequenceStore.removeChangeListener(this.handleSequenceChange);
  },

  render: function () {
    var steps = this.state.sequence ? this.state.sequence.operations : [];
    var operations = this.state.structure ? this.state.structure.operations : [];
    var cx = React.addons.classSet;
    var stepEditorClass = cx({
      'step-editor':  true,
      'hide':         !this.state.step
    });
    var initializationStepClass = cx({
      'selected':   this.state.step === INITIALIZATION_STEP_NAME,
      'clickable':  this.state.step !== INITIALIZATION_STEP_NAME,
      'step':       true
    });
    var initializationContentClass = cx({
      'step-content': true,
      'show':         this.state.step === INITIALIZATION_STEP_NAME
    });
    var initializationInput = {
      validation: this.state.structure ? this.state.structure.validation : {},
      data:       this.state.sequence ? this.state.sequence.data : {},
      onChange:   this.handleInitializationDataChange
    };
    var addStepClass = cx({
      'step':       true,
      'selected':   this.state.step === ADD_STEP_NAME,
      'clickable':  this.state.step !== ADD_STEP_NAME
    });
    var addStepContentClass = cx({
      'step-content': true,
      'show':         this.state.step === ADD_STEP_NAME
    });
    var addStepNameClass = cx({
      'step-name':  true,
      'hide':       this.state.step === ADD_STEP_NAME
    });

    return (
      <div className="sequence-editor">
        <ul className="steps">
          <li className={initializationStepClass} onClick={this.loadInitializationStep}>
            <div className="step-name">{INITIALIZATION_STEP_NAME}</div>
            <div className={initializationContentClass}>
              <DataInput {...initializationInput} />
            </div>
          </li>
          {steps.map(function (step) {
            return (
              <li>
                <div className="step-name">{step.name}</div>
              </li>
            );
          })}
          <li className={addStepClass} onClick={this.addStep}>
            <div className={addStepNameClass}>
              <i className="fa fa-plus"></i>
            </div>
            <div className={addStepContentClass}>
              Hi there this is content
            </div>
          </li>
        </ul>
      </div>
    );
  }
});