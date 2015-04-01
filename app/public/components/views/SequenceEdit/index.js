var React               = require('react');
var SequenceStore       = require('../../../stores/SequenceStore');
var StructureConstants  = require('../../../constants/StructureConstants');

var SequenceEditor;
var editors = {
  ArrayEditor: require('../../partials/ArrayEditor')
};

module.exports = React.createClass({

  getInitialState: function () {
    return {
      sequence: null
    };
  },

  handleSequenceLoaded: function () {
    var state = this.state;
    var editorFileName;
    var editorFilePath;
    state.sequence = SequenceStore.getSequence();
    editor = StructureConstants.editors[state.sequence.type];
    SequenceEditor = editors[editor];
    this.setState(state);
  },

  componentDidMount: function () {
    SequenceStore.addChangeListener(this.handleSequenceLoaded);
  },

  componentWillUnmount: function () {
    SequenceStore.removeChangeListener(this.handleSequenceLoaded);
  },

  render: function () {
    var editor = this.state.sequence ? <SequenceEditor {...this.state.sequence} /> : <div>Loading</div>;
    return (<div>{editor}</div>);
  }
});