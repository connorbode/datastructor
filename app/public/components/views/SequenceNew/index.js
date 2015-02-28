var React            = require('react');
var SequenceEditor   = require('../../partials/SequenceEditor');
var Dropdown         = require('react-select');
var $                = require('jquery');
var StructureActions = require('../../../actions/StructureActions');
var StructureStore   = require('../../../stores/StructureStore');
var _                = require('lodash');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      list: []
    };
  },

  loadList: function () {
    StructureActions.list();
  },

  handleListLoaded: function () {
    this.setState({
      list: StructureStore.getList()
    });
  },

  _onSelect: function () {

  },

  componentDidMount: function () {
    $('#sequence-title').trigger('focus');
    // this.loadList();
    StructureStore.addChangeListener(this.handleListLoaded);
  },

  componentWillUnmount: function () {
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
          <Dropdown name="hi" options={options} onChange={this._onSelect} placeholder="sequence structure" />
          <button>create!</button>
        </div>
      </div>
    );
  }
});