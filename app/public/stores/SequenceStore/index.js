var dispatcher        = require('../../dispatcher');
var EventEmitter      = require('events').EventEmitter;
var assign            = require('object-assign');
var SequenceConstants = require('../../constants/SequenceConstants');
var _                 = require('lodash');

var CHANGE_EVENT = 'change';

var _sequences = [];
var _sequence  = null;

var setSequences = function (sequences) {
  _sequences = sequences;
};

var setSequence = function (sequence) {
  _sequence = sequence;
};

var removeSequence = function (id) {
  _.remove(_sequences, function (s) {
    return s._id === id;
  });
};

var SequenceStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  getSequences: function () {
    return _sequences;
  },

  getSequence: function () {
    return _sequence;
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }, 

  dispatcherIndex: dispatcher.register(function (payload) {

    switch(payload.actionType) {
      case SequenceConstants.LIST_SUCCESS:
        setSequences(payload.data);
        SequenceStore.emitChange();
        break;

      case SequenceConstants.DELETE_SUCCESS:
        removeSequence(payload.id);
        SequenceStore.emitChange();
        break;

      case SequenceConstants.GET_SUCCESS:
        setSequence(payload.data);
        SequenceStore.emitChange();
        break;

      case SequenceConstants.UPDATE_SUCCESS:
        setSequence(payload.data);
        SequenceStore.emitChange();
        break;
    }

    return true;
  })
});

module.exports = SequenceStore;