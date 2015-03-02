var React         = require('react');
var SequenceStore = require('../../../stores/SequenceStore');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequence: {}
    };
  },

  handleSequenceLoaded: function () {
    var currentState = this.state;
    currentState.sequence = SequenceStore.getSequence();
    this.setState(currentState);
  },

  componentDidMount: function () {
    SequenceStore.addChangeListener(this.handleSequenceLoaded);
  },

  componentWillUnmount: function () {
    SequenceStore.removeChangeListener(this.handleSequenceLoaded);
  },

  render: function () {
    return (
      <div className="sequence-viewer">
        <h1>{this.state.sequence.name}</h1>
      </div>
    );
  }
});