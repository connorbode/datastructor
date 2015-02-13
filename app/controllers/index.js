module.exports = function () {

  require('./api')();

  return {
    checkAuth: require('./check-auth'),
    checkParams: require('./check-params'),
    getSession: require('./get-session'),
    error: require('./error'),
    setSession: require('./set-session')
  };
};