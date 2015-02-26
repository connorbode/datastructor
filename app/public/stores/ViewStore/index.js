var dispatcher    = require('../../dispatcher');
var EventEmitter  = require('events').EventEmitter;
var assign        = require('object-assign');
var ViewConstants = require('../../constants/ViewConstants');

var CHANGE_EVENT  = 'change';

var _view         = null;

var setView = function (view) {
  _view = view;
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

  dispatcherIndex: dispatcher.register(function (payload) {

    switch (payload.actionType) {
      case ViewConstants.actions.CHANGE_VIEW:
        setView(payload.view);
        ViewStore.emitChange();
        break;
    }

    return true;
  })
});

module.exports = ViewStore;