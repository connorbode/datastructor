module.exports = function (app) {

  /**
   * @params code {String} the OAuth code received from Github
   * @params callback {Function} the callback function.  pass parameters (err, token)
   */
  return function (code, callback) {
    github.auth.login(code, callback);
  }
};