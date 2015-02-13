module.exports = function () {

  require('./api')();

  return {
    checkParams: require('./check-params'),
    getSession: require('./get-session'),
    error: require('./error'),
    setSession: require('./set-session')
  };
};