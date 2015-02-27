var dispatcher     = require('../../dispatcher');
var ViewConstants  = require('../../constants/ViewConstants');
var ApiActions     = require('../ApiActions');
var SessionActions = require('../SessionActions');


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
  },

  /**
   * Loads a URL path
   * @param {string} path   The path to load
   * @param {object} params Query string parameters
   */
  loadPath: function (path, params) {
    var session = SessionActions.init();

    // log the user in
    if (path === '/auth/github') {
      SessionActions.create({
        code:     params.code,
        provider: 'github'
      }).success(function () {
        ViewActions.go(ViewConstants.views.SEQUENCES);
      });
    }

    // load landing if not logged in
    if (!session) {
      this.go(ViewConstants.views.LANDING);
      return;
    }

    switch (path) {

      case "/":
        this.go(ViewConstants.views.SEQUENCES);
        break;

      case "/sequences":
        this.go(ViewConstants.views.SEQUENCES);
        break;

      default: 
        this.go(ViewConstants.views.FOUR_OH_FOUR);
        break;
    }
  }

};

module.exports = ViewActions;