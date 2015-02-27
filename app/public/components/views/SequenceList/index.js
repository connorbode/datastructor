var React         = require('react');
var UserStore     = require('../../../stores/UserStore');
var $             = require('jquery');
var ViewActions   = require('../../../actions/ViewActions');
var ViewConstants = require('../../../constants/ViewConstants');

module.exports = React.createClass({
  handleAddSequence: function () {
    ViewActions.go(ViewConstants.views.SEQUENCE_NEW);
  },

  componentDidMount: function () {
    $('#add-sequence-btn').on('click', this.handleAddSequence);
  },

  componentWillUnmount: function () {
    $('#add-sequence-btn').off('click', this.handleAddSequence);
  },

  render: function () {
    return (
      <div className="sequence-wrapper">
        <div className="sequences">
          <h1>
            <span>sequences</span>
            <i id="add-sequence-btn" className="fa fa-plus-circle"></i>
          </h1>
          <ul>

          </ul>
          <div className="no-sequences">You don't have any sequences!</div>
        </div>
      </div>
    );
  }
});