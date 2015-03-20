var React           = require('react/addons');
var StructureStore  = require('../../../stores/StructureStore');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      structure: {}
    };
  },

  handleStructureChange: function () {
    this.setState({
      structure: StructureStore.getStructure()
    });
  },

  componentDidMount: function () {
    StructureStore.addChangeListener(this.handleStructureChange);
  },

  componentWillUnmount: function () {
    StructureStore.removeChangeListener(this.handleStructureChange);
  },

  render: function () {
    return (
      <h1>{this.state.structure.name}</h1>
    );
  }
});