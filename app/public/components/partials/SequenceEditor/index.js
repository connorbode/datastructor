var React = require('react');
var SequenceStore   = require('../../../stores/SequenceStore');
var StructureStore  = require('../../../stores/StructureStore');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: null,
      structure: null
    };
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
    return (
      <div className="sequence-editor">
        <ul>
          <li>
            <div className="step-name">Initialization</div>
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