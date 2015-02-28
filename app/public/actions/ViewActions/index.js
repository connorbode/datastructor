var dispatcher       = require('../../dispatcher');
var ViewConstants    = require('../../constants/ViewConstants');
var StructureActions = require('../StructureActions');

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
   */
  go: function (to, options) {
    var id;
    var state; 
    var stateAction; 

    if (!options) {
      options = {
        stateAction: ViewConstants.stateActions.PUSH
      };
    }

    stateAction = options.stateAction;

    if (stateAction !== ViewConstants.stateActions.NONE) {
      id = nextId();
      state = {
        view: to,
        id:   id
      };
      if (stateAction === ViewConstants.stateActions.REPLACE) {
        window.history.replaceState({ view: to, id: id }, to, ViewConstants.paths[to]);
      } else {
        window.history.pushState({ view: to, id: id }, to, ViewConstants.paths[to]);
      }
    }
    dispatcher.dispatch({
      actionType: ViewConstants.actions.CHANGE_VIEW,
      view: to
    });

    // run view specific actions
    switch (to) {
      case ViewConstants.views.SEQUENCE_NEW:
        StructureActions.list();
        break;
    }
  }

};

module.exports = ViewActions;