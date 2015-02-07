module.exports = function (app) {

  require('./api')(app);

  return {
    checkParams: require('./check-params')(app),
    getSession: require('./get-session')(app),
    error: require('./error')(app),
    setSession: require('./set-session')(app)
  };
};