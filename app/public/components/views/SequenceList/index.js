var React         = require('react/addons');
var ViewActions     = require('../../../actions/ViewActions');
var ViewConstants   = require('../../../constants/ViewConstants');
var _               = require('lodash');
var SequenceStore   = require('../../../stores/SequenceStore');
var SequenceActions = require('../../../actions/SequenceActions');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      sequences: [],
      delete: null
    };
  },

  handleSequenceClick: function (e) {
    var id = e.target.getAttribute('data-id');
    ViewActions.go(ViewConstants.views.SEQUENCE_EDIT, {
      stateAction: ViewConstants.stateActions.PUSH
    }, { _id: id });
  },

  handleAddSequence: function () {
    ViewActions.go(ViewConstants.views.SEQUENCE_NEW);
  },

  handleSequenceListLoaded: function () {
    this.setState({
      sequences: SequenceStore.getSequences()
    });
  },

  handleDeleteSequence: function (e) {
    var id   = e.target.getAttribute('data-id');
    var name = e.target.getAttribute('data-name');
    this.setState({
      sequences: this.state.sequences,
      delete: {
        id:   id,
        name: name
      }
    });
  },

  handleCancelDelete: function () {
    this.setState({
      sequences: this.state.sequences,
      delete: null
    });
  },

  handleConfirmDelete: function () {
    SequenceActions.delete(this.state.delete.id);
    this.setState({
      sequences: this.state.sequences,
      delete: null
    });
  },

  componentDidMount: function () {
    SequenceStore.addChangeListener(this.handleSequenceListLoaded);
  },

  componentWillUnmount: function () {
    SequenceStore.removeChangeListener(this.handleSequenceListLoaded);
  },

  render: function () {
    var cx = React.addons.classSet;

    var noSequenceClass = cx({
      'no-results': true,
      'hide':         this.state.sequences.length !== 0
    });

    var deleteSequenceClass = cx({
      'table-center-wrapper': true,
      'delete-result':        true,
      'hide':                 !this.state.delete
    });

    var deleteSequenceOverlayClass = cx({
      'delete-result-overlay': true,
      'hide':                  !this.state.delete
    });

    var deleteName = this.state.delete ? this.state.delete.name : null;

    return (
      <div>
        <div className={deleteSequenceClass}>
          <div className="table-center">
            <div>
              <span>Delete </span>
              <span className="bold">{deleteName}</span>
              <span>?</span>
            </div>
            <div>
              <button onClick={this.handleCancelDelete}>No</button>
              <button onClick={this.handleConfirmDelete}>Yes</button>
            </div>
          </div>
        </div>
        <div className={deleteSequenceOverlayClass}></div>
        <div className="table-center-wrapper">
          <div className="table-center results-list">
            <h1>
              <span>sequences</span>
              <i onClick={this.handleAddSequence} className="fa fa-plus-circle"></i>
            </h1>
            <ul>
              {this.state.sequences.map(function (sequence) {
                return (
                  <li key={sequence._id} data-id={sequence._id} onClick={this.handleSequenceClick}>
                    <span>{sequence.name}</span>
                    <i className="fa fa-times-circle" 
                       onClick={this.handleDeleteSequence} 
                       data-id={sequence._id}
                       data-name={sequence.name}>
                    </i>
                  </li>
                );
              }.bind(this))}
            </ul>
            <div className={noSequenceClass}>You don&rsquo;t have any sequences!</div>
          </div>
        </div>
      </div>
    );
  }
});