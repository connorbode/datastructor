module.exports = function (app) {
  app.routing.resource('sessions', require('./sessions')(app));

  return {
    checkParams: require('./check-params')(app),
    error: require('./error')(app)
  };
};