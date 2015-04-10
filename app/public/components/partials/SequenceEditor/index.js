var React             = require('react');
var SequenceStore     = require('../../../stores/SequenceStore');
var SequenceViewer    = require('../SequenceViewer');
var DataInput         = require('../DataInput');
var SequenceActions   = require('../../../actions/SequenceActions');

var INITIALIZATION_STEP_NAME  = 'Initialization';
var ADD_STEP_NAME             = 'Add Step';

var _sequence;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: this.props.sequence,
      structure: this.props.structure,
      step: null
    };
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

    var viewerProps = {
      structure:  this.state.structure,
      sequence:   this.state.sequence
    };

    return (
      <div>
        <SequenceViewer {...viewerProps} />
        <div className="sequence-editor">
          <ul className="steps">
            <li className="step">
              <div className="step-name">Initialization</div>
            </li>
            {steps.map(function (step) {
              return (
                <li className="step">
                  <div className="step-name">{step.name}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
});