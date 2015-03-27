var React           = require('react');
var SequenceStore   = require('../../../stores/SequenceStore');
var StructureStore  = require('../../../stores/StructureStore');
var DataInput       = require('../DataInput');

var INITIALIZATION_STEP_NAME = 'Initialization';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: null,
      structure: null,
      step: null
    };
  },

  loadInitializationStep: function () {
    var state = this.state;
    state.step = INITIALIZATION_STEP_NAME;
    this.setState(state);
  },

  handleSequenceChange: function () {
    var state = this.state;
    state.sequence = SequenceStore.getSequence();
    this.setState(state);
  },

  handleStructureChange: function () {
    var state = this.state;
    state.structure = StructureStore.getStructure();
    this.setState(state);
  },

  componentDidMount: function () {
    SequenceStore.addChangeListener(this.handleSequenceChange);
    StructureStore.addChangeListener(this.handleStructureChange);
  },

  componentWillUnmount: function () {
    SequenceStore.removeChangeListener(this.handleSequenceChange);
    StructureStore.removeChangeListener(this.handleStructureChange);
  },

  render: function () {
    var operations = this.state.sequence ? this.state.sequence.operations : [];
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
    var initializationInput = this.state.structure ? this.state.structure.validation : {};
    initializationInput.onChange = function (data) {
      console.log(data);
    }
    console.log(this.state.structure);

    return (
      <div className="sequence-editor">
        <ul className="steps">
          <li className={initializationStepClass} onClick={this.loadInitializationStep}>
            <div className="step-name">{INITIALIZATION_STEP_NAME}</div>
            <div className={initializationContentClass}>
              <DataInput {...initializationInput} />
            </div>
          </li>
          {operations.map(function (operation) {
            return (
              <li>
                <div className="step-name">{operation.name}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});