var dispatcher        = require('../../dispatcher');
var ApiActions        = require('../ApiActions');
var SequenceConstants = require('../../constants/SequenceConstants');

var SequenceActions = {
  create: function (params) {
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
    }).error(function () {
      dispatcher.dispatch({
        actionType: SequenceConstants.CREATE_ERROR
      });
    });
  }
};

module.exports = SequenceActions;