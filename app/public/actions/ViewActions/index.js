var dispatcher       = require('../../dispatcher');
var ViewConstants    = require('../../constants/ViewConstants');
var StructureActions = require('../StructureActions');
var SequenceActions  = require('../SequenceActions');

var _id = function () {
  if (window.history.state && window.history.state.id) {
    return window.history.state.id;
  }
  return 0;
}();

function nextId () {
  var id = _id;
  _id += 1;
  return id;
}

var ViewActions = {

  /**
   * Dispatches a view change
   * @param {string} to      The view to load
   * @param {string} options Primarily, how to deal with the history state.
   * @param {string} params  Parameters to send to the new view
   */
  go: function (to, options, params) {
    var id;
    var state; 
    var stateAction; 
    var viewPath = ViewConstants.paths[to];

    if (!options) {
      options = {
        stateAction: ViewConstants.stateActions.PUSH
      };
    }

    // run view specific actions
    switch (to) {
      case ViewConstants.views.SEQUENCE_LIST:
        SequenceActions.list();
        break;

      case ViewConstants.views.SEQUENCE_NEW:
        StructureActions.list();
        break;

      case ViewConstants.views.SEQUENCE_EDIT:
        viewPath = viewPath.replace(/:id/, params._id);
        break;

    }

    // run push action
    stateAction = options.stateAction;

    if (stateAction !== ViewConstants.stateActions.NONE) {
      id = nextId();
      state = {
        view: to,
        id:   id
      };
      if (stateAction === ViewConstants.stateActions.REPLACE) {
        window.history.replaceState({ view: to, id: id }, to, viewPath);
      } else {
        window.history.pushState({ view: to, id: id }, to, viewPath);
      }
    }
    dispatcher.dispatch({
      actionType: ViewConstants.actions.CHANGE_VIEW,
      view: to
    });
  }

};

module.exports = ViewActions;