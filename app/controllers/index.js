module.exports = function (app) {

  require('./api')(app);

  return {
    checkParams: require('./check-params')(app),
    error: require('./error')(app)
  };
};