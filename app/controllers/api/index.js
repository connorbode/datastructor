module.exports = function () {
  app.routing.resource('api/accounts', require('./accounts'));
  app.routing.resource('api/sequences', require('./sequences'));
  app.routing.resource('api/sessions', require('./sessions'));
};