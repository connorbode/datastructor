var React           = require('react');
var SequenceStore   = require('../../../stores/SequenceStore');
var StructureStore  = require('../../../stores/StructureStore');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: {},
      structure: {}
    };
  },

  handleSequenceLoaded: function () {
    var currentState = this.state;
    currentState.sequence = SequenceStore.getSequence();
    this.setState(currentState);
  },

  handleStructureLoaded: function () {
    var currentState = this.state;
    currentState.structure = StructureStore.getStructure();
    this.setState(currentState);
  },

  componentDidMount: function () {
    SequenceStore.addChangeListener(this.handleSequenceLoaded);
    StructureStore.addChangeListener(this.handleStructureLoaded);
  },

  componentWillUnmount: function () {
    SequenceStore.removeChangeListener(this.handleSequenceLoaded);
    StructureStore.removeChangeListener(this.handleStructureLoaded);
  },

  render: function () {
    return (
      <div className="sequence-viewer">
        <h1>{this.state.sequence.name}</h1>
        <h2>{this.state.structure.name}</h2>
      </div>
    );
  }
});