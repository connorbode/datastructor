var dispatcher          = require('../../dispatcher');
var ApiActions          = require('../ApiActions');
var StructureConstants  = require('../../constants/StructureConstants');

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
      })
    }).error(function (err) {
      dispatcher.dispatch({
        actionType: StructureConstants.CREATE_ERROR
      });
    });
  }
};