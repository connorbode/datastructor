module.exports = function (app) {

  /**
   * @params code {String} the OAuth code received from Github
   * @params callback {Function} the callback function.  pass parameters (err, token)
   */
  return function (code, callback) {
    var github = app.sso.github;
    var email;
    github.auth.login(code, function (err, token) {
      if (err) {
        callback(err);
        return;
      }

      github.client().me().emails(function (err, data, headers) {
        if (err) {
          callback(err);
          return;
        }

        email = _.where(data, { primary: true})[0].email;
        callback(err, token, email);
        return;
      });
    });
  }
};