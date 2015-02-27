var dispatcher       = require('../../dispatcher');
var ApiActions       = require('../ApiActions');
var SessionConstants = require('../../constants/SessionConstants');

module.exports = {
  create: function (params) {
    ApiActions.request({
      url:    '/api/sessions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      data: JSON.stringify(params),
    }).success(function (data, xhr, status) {
      dispatcher.dispatch({
        actionType: SessionConstants.AUTH_SUCCESS,
        data:       data
      });
    }).error(function () {
      dispatcher.dispatch({
        actionType: SessionConstants.AUTH_ERROR
      })
    });
  }
};