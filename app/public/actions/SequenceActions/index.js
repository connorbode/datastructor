var dispatcher        = require('../../dispatcher');
var ApiActions        = require('../ApiActions');
var SequenceConstants = require('../../constants/SequenceConstants');
var ViewConstants     = require('../../constants/ViewConstants');

var SequenceActions = {
  create: function (params) {
    var ViewActions = require('../ViewActions');
    ApiActions.request({
      method:   'POST',
      url:      '/api/sequences',
      dataType: 'json',
      data:     JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function (data) {
      dispatcher.dispatch({
        actionType: SequenceConstants.CREATE_SUCCESS,
        data:       data
      });
      ViewActions.go(ViewConstants.views.SEQUENCE_EDIT, {
        stateAction: ViewConstants.stateActions.PUSH
      }, data);
    }).error(function () {
      dispatcher.dispatch({
        actionType: SequenceConstants.CREATE_ERROR
      });
    });
  },

  list: function () {
    ApiActions.request({
      method:   'GET',
      url:      '/api/sequences',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function (data) {
      dispatcher.dispatch({
        actionType: SequenceConstants.LIST_SUCCESS,
        data: data
      });
    }).error(function () {
      dispatcher.dispatch({
        actionType: SequenceConstants.LIST_ERROR
      });
    });
  },

  delete: function (id) {
    ApiActions.request({
      method: 'DELETE',
      url:    '/api/sequences/' + id
    }).success(function (data) {
      dispatcher.dispatch({
        actionType: SequenceConstants.DELETE_SUCCESS,
        id: id
      });
    }).error(function () {
      dispatcher.dispatch({
        actionType: SequenceConstants.DELETE_ERROR
      });
    });
  },

  get: function (id) {
    return ApiActions.request({
      method:   'GET',
      url:      '/api/sequences/' + id,
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function (data) {
      dispatcher.dispatch({
        actionType: SequenceConstants.GET_SUCCESS,
        data: data
      });
    }).error(function () {
      dispatcher.dispatch({
        actionType: SequenceConstants.GET_ERROR
      });
    });
  }
};

module.exports = SequenceActions;