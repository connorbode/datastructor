var dispatcher   = require('../../dispatcher');
var $            = require('jquery');
var ApiConstants = require('../../constants/ApiConstants');

module.exports = {
  request: function (params) {
    dispatcher.dispatch({
      actionType: ApiConstants.REQUEST
    });
    return $.ajax(params)
      .success(function (data, xhr, status) {
        dispatcher.dispatch({
          actionType: ApiConstants.SUCCESS
        });
      })
      .error(function (err) {
        dispatcher.dispatch({
          actionType: ApiConstants.FAILURE
        });
      });
  }
};