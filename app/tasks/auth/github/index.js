module.exports = function (app) {

  /**
   * @params params.code {String} the OAuth code received from Github
   * @params params.callback {Function} the callback function.  pass parameters (err, token)
   */
  return function (params) {
    github.auth.login(params.code, params.callback);
  }
};