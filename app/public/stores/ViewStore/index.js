var dispatcher       = require('../../dispatcher');
var EventEmitter     = require('events').EventEmitter;
var assign           = require('object-assign');
var ViewConstants    = require('../../constants/ViewConstants');
var SessionConstants = require('../../constants/SessionConstants');
var ApiConstants     = require('../../constants/ApiConstants');

var CHANGE_EVENT  = 'change';

var _view         = ViewConstants.views.LANDING;
var _loading      = false;
var _error        = false;

var setView = function (view) {
  _view = view;
}

var setLoading = function (loading) {
  _loading = loading;
}

var setError = function (error) {
  _error = error;
}

var ViewStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getView: function () {
    return _view;
  },

  getLoading: function () {
    return _loading;
  },

  getError: function () {
    return _error;
  },

  dispatcherIndex: dispatcher.register(function (payload) {

    switch (payload.actionType) {
      case ViewConstants.actions.CHANGE_VIEW:
        setView(payload.view);
        ViewStore.emitChange();
        break;

      case SessionConstants.AUTH_SUCCESS:
        setView(ViewConstants.views.SEQUENCES);
        ViewStore.emitChange();
        break;

      case ApiConstants.REQUEST:
        setLoading(true);
        ViewStore.emitChange();
        break;

      case ApiConstants.SUCCESS:
        setLoading(false);
        ViewStore.emitChange();
        break;

      case ApiConstants.ERROR:
        setLoading(false);
        setError(true);
        ViewStore.emitChange();
        break;
    }

    return true;
  })
});

module.exports = ViewStore;