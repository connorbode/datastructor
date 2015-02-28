module.exports = function () {
  app.routing.resource('api/sequences', require('./sequences'));
  app.routing.resource('api/sessions', require('./sessions'));
  app.routing.resource('api/structures', require('./structures'));
};