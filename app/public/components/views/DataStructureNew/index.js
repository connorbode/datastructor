var React             = require('react');
var Dropdown          = require('react-select');
var StructureStore    = require('../../../stores/StructureStore');

var structure = null;
var titleElem;
var createBtnElem;

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

  createStructure: function () {
  },

  _onSelect: function (selection) {
    structure = selection;
  },

  componentDidMount: function () {
    titleElem     = document.getElementById('structure-title');
    createBtnElem = document.getElementById('create-btn');
    titleElem.focus();
    createBtnElem.addEventListener('click', this.createStructure);
    StructureStore.addChangeListener(this.handleListLoaded);
  },

  componentWillUnmount: function () {
    createBtnElem.removeEventListener('click', this.createStructure);
    StructureStore.removeChangeListener(this.handleListLoaded);
  },

  render: function () {
    var options = this.state.list.reduce(function (opts, item) {
      opts.push({
        value: item._id,
        label: item.name
      });
      return opts;
    }, []);
    return (
      <div className="table-center-wrapper">
        <div className="table-center item-new">
          <h1>add a data structure</h1>
          <input id="structure-title" type="text" placeholder="title" />
          <button id="create-btn">create!</button>
        </div>
      </div>
    );
  }
});