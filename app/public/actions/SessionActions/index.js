var dispatcher       = require('../../dispatcher');
var ApiActions       = require('../ApiActions');
var SessionConstants = require('../../constants/SessionConstants');
var cookie           = require('cookie');

function saveSession (data) {
  var stringData = JSON.stringify(data);
  var cookieData = cookie.serialize('session', stringData, {
    path: '/'
  });
  document.cookie = cookieData;
}

function loadSession () {
  var parsedCookie  = cookie.parse(document.cookie);
  var sessionCookie = parsedCookie.session ? JSON.parse(parsedCookie.session) : undefined;
  return sessionCookie;
}

module.exports = {
  create: function (params, callback) {
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
      saveSession(data);
      if (callback) {
        callback();
      }
    }).error(function () {
      dispatcher.dispatch({
        actionType: SessionConstants.AUTH_ERROR
      });
    });
  },

  init: function (callback) {
    var session = loadSession();
    if (session) {
      dispatcher.dispatch({
        actionType: SessionConstants.AUTH_LOADED,
        data:       session
      });
    } else {
      dispatcher.dispatch({
        actionType: SessionConstants.AUTH_NONE
      });
    }
    return session;
  }
};