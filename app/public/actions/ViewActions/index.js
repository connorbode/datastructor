var dispatcher    = require('../../dispatcher');
var ViewConstants = require('../../constants/ViewConstants');

module.exports = {

  /**
   * Dispatches a view change
   * @param {string} to     The view to load
   * @param {string} origin The component that the request originated from
   */
  go: function (to, origin) {
    dispatcher.dispatch({
      actionType: ViewConstants.actions.CHANGE_VIEW,
      origin: origin,
      view: to
    });
  }

};