module.exports = function () {

  require('./api')();

  return {
    checkAuth:    require('./check-auth'),
    checkParams:  require('./check-params'),
    getSession:   require('./get-session'),
    error:        require('./error'),
    setListVars:  require('./set-list-vars'),
    setSession:   require('./set-session')
  };
};