module.exports = function (app) {
  app.routing.resource('api/accounts', require('./accounts')(app));
  app.routing.resource('api/sessions', require('./sessions')(app));
};