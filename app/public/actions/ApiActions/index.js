var dispatcher   = require('../../dispatcher');
var $            = require('jquery');
var ApiConstants = require('../../constants/ApiConstants');

function request (request) {
  return $.ajax(request).error(function () {
    dispatcher.dispatch({
      actionType: ApiConstants.ERROR, 
      request:    request
    });
  }).success(function (data) {
    dispatcher.dispatch({
      actionType: ApiConstants.SUCCESS,
      request:    request,
      data:       data
    });
  });
}

module.exports = {

  session: {
    create: function (params) {
      console.log(params);
      request({
        url:    '/api/sessions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        dataType: 'json',
        data: JSON.stringify(params),
      }).success(function (data, xhr, status) {
        dispatcher.dispatch({
          actionType: ApiConstants.AUTH_SUCCESS,
          request:    request,
          data:       data
        });
      }).error(function () {
        dispatcher.dispatch({
          actionType: ApiConstants.AUTH_ERROR,
          request:    request
        })
      });
    }
  }

};