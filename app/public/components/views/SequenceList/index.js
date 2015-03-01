var React         = require('react/addons');
var $             = require('jquery');
var ViewActions   = require('../../../actions/ViewActions');
var ViewConstants = require('../../../constants/ViewConstants');
var _             = require('lodash');
var SequenceStore = require('../../../stores/SequenceStore');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequences: []
    };
  },

  handleAddSequence: function () {
    ViewActions.go(ViewConstants.views.SEQUENCE_NEW);
  },

  handleSequenceListLoaded: function () {
    this.setState({
      sequences: SequenceStore.getSequences()
    });
  },

  componentDidMount: function () {
    $('#add-sequence-btn').on('click', this.handleAddSequence);
    SequenceStore.addChangeListener(this.handleSequenceListLoaded);
  },

  componentWillUnmount: function () {
    $('#add-sequence-btn').off('click', this.handleAddSequence);
    SequenceStore.removeChangeListener(this.handleSequenceListLoaded);
  },

  render: function () {
    var cx = React.addons.classSet;

    var sequences = _.reduce(this.state.sequences, function (result, sequence) {
      result.push(<li key={sequence._id}>{sequence.name}</li>);
      return result;
    }, []);

    var noSequence = cx({
      'no-sequences': true,
      'hide':         this.state.sequences.length !== 0
    });

    return (
      <div className="table-center-wrapper">
        <div className="table-center sequences">
          <h1>
            <span>sequences</span>
            <i id="add-sequence-btn" className="fa fa-plus-circle"></i>
          </h1>
          <ul>{sequences}</ul>
          <div className={noSequence}>You don't have any sequences!</div>
        </div>
      </div>
    );
  }
});