var dispatcher          = require('../../dispatcher');
var ApiActions          = require('../ApiActions');
var StructureConstants  = require('../../constants/StructureConstants');
var ViewConstants       = require('../../constants/ViewConstants');

module.exports = {
  list: function () {
    ApiActions.request({
      url:    '/api/structures',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      dataType: 'json'
    }).success(function (data) {
      dispatcher.dispatch({
        actionType: StructureConstants.LIST_SUCCESS,
        data:       data
      });
    }).error(function (err) {
      dispatcher.dispatch({
        actionType: StructureConstants.LIST_ERROR
      })
    });
  },

  get: function (id) {
    ApiActions.request({
      url:    '/api/structures/' + id,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      dataType: 'json'
    }).success(function (data) {
      dispatcher.dispatch({
        actionType: StructureConstants.GET_SUCCESS,
        data:       data
      });
    }).error(function (err) {
      dispatcher.dispatch({
        actionType: StructureConstants.GET_ERROR
      });
    });
  },

  create: function (params) {
    var ViewActions = require('../ViewActions');

    ApiActions.request({
      url:      '/api/structures/',
      method:   'POST',
      dataType: 'json',
      data:     JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function (data) {
      dispatcher.dispatch({
        actionType: StructureConstants.CREATE_SUCCESS,
        data:       data
      });
      ViewActions.go(ViewConstants.views.DATA_STRUCTURE_EDIT, {
        stateAction: ViewConstants.stateActions.PUSH
      }, data);
    }).error(function (err) {
      dispatcher.dispatch({
        actionType: StructureConstants.CREATE_ERROR
      });
    });
  },

  update: function (params) {
    ApiActions.request({
      dataType: 'json',
      method:   'PUT',
      data:     JSON.stringify(params),
      url:      '/api/structures/' + params._id,
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function (data) {
      dispatcher.dispatch({
        actionType: StructureConstants.UPDATE_SUCCESS,
        data:       data
      });
    }).error(function (err) {
      dispatcher.dispatch({
        actionType: StructureConstants.UPDATE_ERROR
      });
    });
  }
};