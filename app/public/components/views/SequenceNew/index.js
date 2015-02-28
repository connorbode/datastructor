var React          = require('react');
var SequenceEditor = require('../../partials/SequenceEditor');
var Dropdown       = require('react-select');
var $              = require('jquery');

module.exports = React.createClass({
  _onSelect: function () {

  },

  componentDidMount: function () {
    $('#sequence-title').trigger('focus');
  },

  render: function () {
    var options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];
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