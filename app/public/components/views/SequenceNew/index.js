var React             = require('react');
var Dropdown          = require('react-select');
var $                 = require('jquery');
var StructureActions  = require('../../../actions/StructureActions');
var StructureStore    = require('../../../stores/StructureStore');
var SequenceActions   = require('../../../actions/SequenceActions');
var _                 = require('lodash');

var structure = null;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      list:      []
    };
  },

  handleListLoaded: function () {
    this.setState({
      list:      StructureStore.getList()
    });
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
    StructureStore.addChangeListener(this.handleListLoaded);
  },

  componentWillUnmount: function () {
    $('#create-sequence').off('click', this.createSequence);
    StructureStore.removeChangeListener(this.handleListLoaded);
  },

  render: function () {
    var options = _.reduce(this.state.list, function (opts, item) {
      opts.push({
        value: item._id,
        label: item.name
      });
      return opts;
    }, []);
    return (
      <div className="table-center-wrapper">
        <div className="table-center sequence-new">
          <h1>add a sequence</h1>
          <input id="sequence-title" type="text" placeholder="sequence title" />
          <Dropdown options={options} onChange={this._onSelect} placeholder="sequence structure" />
          <button id="create-sequence">create!</button>
        </div>
      </div>
    );
  }
});