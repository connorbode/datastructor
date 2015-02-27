var dispatcher     = require('../../dispatcher');
var ViewConstants  = require('../../constants/ViewConstants');

var ViewActions = {

  /**
   * Dispatches a view change
   * @param {string} to     The view to load
   * @param {string} params Parameters to send to the view
   */
  go: function (to) {
    window.history.pushState({}, to, ViewConstants.paths[to]);
    dispatcher.dispatch({
      actionType: ViewConstants.actions.CHANGE_VIEW,
      view: to
    });
  }

};

module.exports = ViewActions;