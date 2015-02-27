var dispatcher       = require('../../dispatcher');
var ApiActions       = require('../ApiActions');
var SessionConstants = require('../../constants/SessionConstants');
var cookie           = require('cookie');
var ViewActions      = require('../ViewActions');
var ViewConstants    = require('../../constants/ViewConstants');

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

function destroySession () {
  document.cookie = 'session=';
}

module.exports = {
  create: function (params) {
    return ApiActions.request({
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
    }).error(function () {
      dispatcher.dispatch({
        actionType: SessionConstants.AUTH_ERROR
      });
    });
  },

  init: function () {
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
  },

  destroy: function () {
    ApiActions.request({
      url:    '/api/sessions/kill',
      method: 'DELETE',
    }).success(function (data, xhr, status) {
      destroySession();
      dispatcher.dispatch({
        actionType: SessionConstants.LOGOUT_SUCCESS
      });
      ViewActions.go(ViewConstants.views.LANDING);
    }).error(function () {
      dispatcher.dispatch({
        actionType: SessionConstants.LOGOUT_ERROR
      });
    });
  }
};