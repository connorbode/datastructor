var dispatcher     = require('../../dispatcher');
var $              = require('jquery');
var ApiConstants   = require('../../constants/ApiConstants');

module.exports = {
  request: function (params) {
    var SessionActions = require('../SessionActions');
    dispatcher.dispatch({
      actionType: ApiConstants.REQUEST
    });
    return $.ajax(params)
      .success(function (data, xhr, status) {
        dispatcher.dispatch({
          actionType: ApiConstants.SUCCESS
        });
      })
      .error(function (xhr) {
        dispatcher.dispatch({
          actionType: ApiConstants.FAILURE
        });
        if (xhr.status === 401) {
          SessionActions.clean();
        }
      });
  }
};