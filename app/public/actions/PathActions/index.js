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
    var matchers, matches;

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

    // run path matchers
    matchers = {
      editSequence:   path.match(/\/sequences\/([a-z0-9]*)\/edit/),
      editStructure:  path.match(/\/data-structures\/([a-z0-9]*)\/edit/)
    };

    matches = {
      editSequence: {
        match:    matchers.editSequence ? matchers.editSequence[0] : '',
        id:       matchers.editSequence ? matchers.editSequence[1] : null
      },
      editStructure: {
        match:    matchers.editStructure ? matchers.editStructure[0] : '',
        id:       matchers.editStructure ? matchers.editStructure[1] : null
      }
    };

    switch (path) {

      // landing page -- forward to list sequences
      case "/":
        ViewActions.go(ViewConstants.views.SEQUENCE_LIST, actionOptions);
        break;

      // list sequences
      case "/sequences":
        ViewActions.go(ViewConstants.views.SEQUENCE_LIST, actionOptions);
        break;

      // add sequence
      case "/sequences/new":
        ViewActions.go(ViewConstants.views.SEQUENCE_NEW, actionOptions);
        break;

      // edit sequence
      case matches.editSequence.match:
        ViewActions.go(ViewConstants.views.SEQUENCE_EDIT, actionOptions, { _id: matches.editSequence.id });
        break;

      default: 
        ViewActions.go(ViewConstants.views.FOUR_OH_FOUR, actionOptions);
        break;
    }
  }
};

module.exports = PathActions;