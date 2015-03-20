var React                 = require('react/addons');
var ViewActions           = require('../../../actions/ViewActions');
var ViewConstants         = require('../../../constants/ViewConstants');
var _                     = require('lodash');
var DataStructureStore    = require('../../../stores/DataStructureStore');
var DataStructureActions  = require('../../../actions/DataStructureActions');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      dataStructures: [],
      delete: null
    };
  },

  handleDataStructureClick: function (e) {
    var id = e.target.getAttribute('data-id');
    ViewActions.go(ViewConstants.views.DATA_STRUCTURE_EDIT, {
      stateAction: ViewConstants.stateActions.PUSH
    }, { _id: id });
  },

  handleAddDataStructure: function () {
    ViewActions.go(ViewConstants.views.DATA_STRUCTURE_NEW);
  },

  handleDataStructureListLoaded: function () {
    this.setState({
      dataStructures: DataStructureStore.getDataStructures()
    });
  },

  handleDeleteDataStructure: function (e) {
    var id   = e.target.getAttribute('data-id');
    var name = e.target.getAttribute('data-name');
    this.setState({
      dataStructures: this.state.dataStructures,
      delete: {
        id:   id,
        name: name
      }
    });
  },

  handleCancelDelete: function () {
    this.setState({
      dataStructures: this.state.dataStructures,
      delete: null
    });
  },

  handleConfirmDelete: function () {
    DataStructureActions.delete(this.state.delete.id);
    this.setState({
      dataStructures: this.state.dataStructures,
      delete: null
    });
  },

  componentDidMount: function () {
    // DataStructureStore.addChangeListener(this.handleDataStructureListLoaded);
  },

  componentWillUnmount: function () {
    // DataStructureStore.removeChangeListener(this.handleDataStructureListLoaded);
  },

  render: function () {
    var cx = React.addons.classSet;

    var noDataStructureClass = cx({
      'no-results': true,
      'hide':       this.state.dataStructures.length !== 0
    });

    var deleteDataStructureClass = cx({
      'table-center-wrapper':   true,
      'delete-result':          true,
      'hide':                   !this.state.delete
    });

    var deleteDataStructureOverlayClass = cx({
      'delete-result':  true,
      'hide':           !this.state.delete
    });

    var deleteName = this.state.delete ? this.state.delete.name : null;

    return (
      <div>
        <div className={deleteDataStructureClass}>
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
        <div className={deleteDataStructureOverlayClass}></div>
        <div className="table-center-wrapper">
          <div className="table-center results-list">
            <h1>
              <span>data structures</span>
              <i onClick={this.handleAddDataStructure} className="fa fa-plus-circle"></i>
            </h1>
            <ul>
              {this.state.dataStructures.map(function (dataStructure) {
                return (
                  <li key={dataStructure._id} data-id={dataStructure._id} onClick={this.handleDataStructureClick}>
                    <span>{dataStructure.name}</span>
                    <i className="fa fa-times-circle" 
                       onClick={this.handleDeleteDataStructure} 
                       data-id={dataStructure._id}
                       data-name={dataStructure.name}>
                    </i>
                  </li>
                );
              }.bind(this))}
            </ul>
            <div className={noDataStructureClass}>You don&rsquo;t have any data structures!</div>
          </div>
        </div>
      </div>
    );
  }
});