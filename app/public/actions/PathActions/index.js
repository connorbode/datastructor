var dispatcher     = require('../../dispatcher');
var ViewConstants  = require('../../constants/ViewConstants');
var SessionActions = require('../SessionActions');
var ViewActions    = require('../ViewActions');

var PathActions = {
 /**
   * Loads a URL path
   * @param {string} path   The path to load
   * @param {object} params Query string parameters
   */
  loadPath: function (path, params) {
    var session = SessionActions.init();
    var actionOptions = {
      stateAction: ViewConstants.stateActions.REPLACE
    };

    // log the user in
    if (path === '/auth/github') {
      SessionActions.create({
        code:     params.code,
        provider: 'github'
      }).success(function () {
        ViewActions.go(ViewConstants.views.SEQUENCE_LIST, actionOptions);
      });
    }

    // load landing if not logged in
    if (!session) {
      ViewActions.go(ViewConstants.views.LANDING, actionOptions);
      return;
    }

    switch (path) {

      case "/":
        ViewActions.go(ViewConstants.views.SEQUENCE_LIST, actionOptions);
        break;

      case "/sequences":
        ViewActions.go(ViewConstants.views.SEQUENCE_LIST, actionOptions);
        break;

      case "/sequences/new":
        ViewActions.go(ViewConstants.views.SEQUENCE_NEW, actionOptions);
        break;

      default: 
        ViewActions.go(ViewConstants.views.FOUR_OH_FOUR, actionOptions);
        break;
    }
  }
};

module.exports = PathActions;