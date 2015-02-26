var dispatcher     = require('../../dispatcher');
var ViewConstants  = require('../../constants/ViewConstants');

module.exports = {

  /**
   * Dispatches a view change
   * @param {string} to     The view to load
   * @param {string} params Parameters to send to the view
   */
  go: function (to) {
    dispatcher.dispatch({
      actionType: ViewConstants.actions.CHANGE_VIEW,
      view: to
    });
  },

  /**
   * Loads a URL path
   * @param {string} path   The path to load
   * @param {object} params Query string parameters
   */
  loadPath: function (path, params) {
    switch (path) {

      case "/":
        this.go(ViewConstants.views.LANDING);
        break;

      default: 
        this.go(ViewConstants.views.FOUR_OH_FOUR);
        break;
    }
  }

};