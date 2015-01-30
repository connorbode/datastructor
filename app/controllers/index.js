module.exports = function (app) {
  app.routing.resource('sessions', require('./sessions')(app));
};