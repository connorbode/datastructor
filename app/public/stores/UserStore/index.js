var dispatcher       = require('../../dispatcher');
var cookie           = require('cookie');
var EventEmitter     = require('events').EventEmitter;
var assign           = require('object-assign');
var SessionConstants = require('../../constants/SessionConstants');

var CHANGE_EVENT = 'change';

var _user        = null;
var _authFailed  = false;

var setUser = function (user) {
  _user       = user;
  _authFailed = false;
}

var UserStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getUser: function () {
    return _user;
  },

  isLoggedIn: function () {
    return _user !== null;
  },

  authFailed: function () {
    return _authFailed;
  },

  dispatcherIndex: dispatcher.register(function (payload) {

    var email;
    var emailCookie;

    switch (payload.actionType) {
      case SessionConstants.AUTH_SUCCESS:
        email = payload.data.email;
        emailCookie = cookie.serialize('email', email);
        document.cookie = emailCookie;
        UserStore.emitChange();
        break;

      case SessionConstants.AUTH_ERROR:
        _authFailed = true;
        UserStore.emitChange();
        break;
    }

    return true;
  })
});

module.exports = UserStore;