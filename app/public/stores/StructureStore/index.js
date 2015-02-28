var dispatcher         = require('../../dispatcher');
var EventEmitter       = require('events').EventEmitter;
var assign             = require('object-assign');
var StructureConstants = require('../../constants/StructureConstants');
var _                  = require('lodash');

var CHANGE_EVENT = 'change';

function updateList (list) {
  _structures = list;
}

var StructureStore = assign({}, EventEmitter.prototype, {
  getList: function () {
    return _structures;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: dispatcher.register(function (payload) {

    switch (payload.actionType) {
      case StructureConstants.LIST_SUCCESS:
        updateList(payload.data);
        StructureStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = StructureStore;