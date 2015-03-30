var React               = require('react');
var Dropdown            = require('react-select');
var $                   = require('jquery');
var SequenceActions     = require('../../../actions/SequenceActions');
var StructureConstants  = require('../../../constants/StructureConstants');

var structure = null;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      list:      []
    };
  },

  initStructures: function () {
    var key;
    var val;
    var structures = [];
    var state = this.state;
    for (key in StructureConstants.types) {
      val = StructureConstants.types[key];
      structures.push({
        value: val,
        label: val
      });
    }
    state.list = structures;
    this.setState(state);
  },

  createSequence: function () {
    SequenceActions.create({
      type: structure,
      name: $('#sequence-title').val()
    });
  },

  _onSelect: function (selection) {
    structure = selection;
  },

  componentDidMount: function () {
    $('#sequence-title').trigger('focus');
    $('#create-sequence').on('click', this.createSequence);
    this.initStructures();
  },

  componentWillUnmount: function () {
    $('#create-sequence').off('click', this.createSequence);
  },

  render: function () {
    return (
      <div className="table-center-wrapper">
        <div className="table-center item-new">
          <h1>add a sequence</h1>
          <input id="sequence-title" type="text" placeholder="sequence title" />
          <Dropdown options={this.state.list} onChange={this._onSelect} placeholder="sequence structure" />
          <button id="create-sequence">create!</button>
        </div>
      </div>
    );
  }
});